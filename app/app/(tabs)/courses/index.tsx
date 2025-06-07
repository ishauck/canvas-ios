import { useTheme } from "@/hooks/use-theme";
import { View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity, Image, StyleSheet, Animated } from "react-native";
import useCourses from "@/hooks/use-courses";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, memo, useRef } from "react";
import type { CanvasCourse } from "@/types/course";
import useColors from "@/hooks/use-colors";
import useDashboardCards from "@/hooks/use-dashboard-cards";

const CourseCard = memo(({ course, index, maxLength, onPress }: { course: CanvasCourse, index: number, maxLength: number, onPress?: () => void }) => {
  const theme = useTheme();
  const colors = useColors();
  const color = colors.data?.[`course_${course.id}`];
  const imageUrl = course.image_download_url;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 1.06,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 20,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      style={{
        backgroundColor: theme.surface,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.10,
        shadowRadius: 6,
        elevation: 3,
        borderTopLeftRadius: index === 0 ? 12 : 0,
        borderTopRightRadius: index === 0 ? 12 : 0,
        borderBottomLeftRadius: index === maxLength - 1 ? 12 : 0,
        borderBottomRightRadius: index === maxLength - 1 ? 12 : 0,
        borderWidth: 1,
        borderLeftWidth: 0,
        borderRightWidth: 0,
        borderBottomWidth: 0,
        borderTopWidth: index === 0 ? 0 : 1,
        borderColor: theme.border,
        padding: 0,
        overflow: "hidden",
      }}
      accessibilityLabel={`Open course: ${course.name}`}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <View style={{
        width: "100%",
        height: 128,
        borderTopLeftRadius: index === 0 ? 12 : 0,
        borderTopRightRadius: index === 0 ? 12 : 0,
        overflow: "hidden"
      }}>
        {imageUrl ? (
          <Animated.Image
            source={{ uri: imageUrl }}
            style={[
              {
                width: "100%",
                height: "100%",
                transform: [{ scale: scaleAnim }],
              },
            ]}
            resizeMode="cover"
          />
        ) : (
          <View style={{
            width: "100%",
            height: "100%",
            backgroundColor: color || theme.surface,
            alignItems: "center",
            justifyContent: "center"
          }} />
        )}
      </View>
      <View style={{ padding: 16, gap: 4 }}>
        <Text style={{ color: theme.text, fontSize: 16, fontWeight: "700", marginBottom: 2 }} numberOfLines={1}>{course.name}</Text>
        {course.course_code && (
          <Text style={{ color: theme.text, fontSize: 13, opacity: 0.6, fontWeight: "500" }} numberOfLines={1}>{course.course_code}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
});

export default function Courses() {
  const theme = useTheme();
  const courses = useCourses();
  const dashboardCards = useDashboardCards();
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (courses.refetch) {
      courses.refetch().then(() => {
        dashboardCards.refetch();
      }).finally(() => setRefreshing(false));
    } else {
      setTimeout(() => setRefreshing(false), 1000);
    }
  }, [courses, dashboardCards]);

  const renderItem = useCallback(({ item, index }: { item: CanvasCourse, index: number }) => (
    <CourseCard course={item} index={index} maxLength={courses.data?.length || 0} />
  ), [courses.data?.length]);

  if (courses.isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={[styles.title, { color: theme.text }]}>Courses</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Your enrolled courses will appear here</Text>
        <ActivityIndicator size="large" color={theme.text} />
      </View>
    );
  }

  if (courses.error) {
    console.error("Error: " + courses.error);
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <Text style={[styles.title, { color: theme.text }]}>Courses</Text>
        <Text style={[styles.subtitle, { color: theme.text }]}>Your enrolled courses will appear here</Text>
        <Text style={{ color: theme.text }}>Error: {courses.error?.message || 'Unknown error'}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Courses</Text>
      <Text style={[styles.subtitle, { color: theme.text }]}>Your enrolled courses will appear here</Text>
      <FlatList
        data={courses.data?.sort((a, b) => {
          const aPosition = dashboardCards.data?.find((card) => card.assetString === `course_${a.id}`)?.position;
          const bPosition = dashboardCards.data?.find((card) => card.assetString === `course_${b.id}`)?.position;
          return (aPosition || 0) - (bPosition || 0);
        })}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={theme.text} />}
        ListEmptyComponent={
          <View style={{ alignItems: 'center', marginTop: 48 }}>
            <Ionicons name="book-outline" size={48} color={theme.text} style={{ opacity: 0.2 }} />
            <Text style={{ color: theme.text, opacity: 0.5, marginTop: 12, fontSize: 16, textAlign: 'center' }}>
              No courses found. Pull to refresh or check back later!
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 32 }}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
    marginBottom: 16,
  }
});