import { useTheme } from "@/hooks/use-theme";
import useUser from "@/hooks/use-user";
import { View, Image, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useMemo } from "react";
import { FlashList } from "@shopify/flash-list";
import useFeed from "@/hooks/use-feed";
import useColors from "@/hooks/use-colors";
import { CanvasActivityStreamItem } from "@/services/canvas/get-feed";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import useCourses from "@/hooks/use-courses";

function getTypeIcon(type: string) {
  switch (type) {
    case 'Announcement':
      return { name: 'bullhorn', color: '#fbbf24' };
    case 'DiscussionTopic':
      return { name: 'forum', color: '#60a5fa' };
    case 'Submission':
      return { name: 'file-document', color: '#34d399' };
    case 'Message':
      return { name: 'email', color: '#f472b6' };
    case 'Conference':
      return { name: 'video', color: '#a78bfa' };
    case 'Collaboration':
      return { name: 'account-group', color: '#f87171' };
    case 'AssessmentRequest':
      return { name: 'clipboard-list', color: '#facc15' };
    default:
      return { name: 'alert-circle-outline', color: '#9ca3af' };
  }
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function Courses() {
  const theme = useTheme();
  const user = useUser();
  const feed = useFeed();
  const courses = useCourses();
  const colors = useColors();

  // Greeting logic
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good morning";
    if (hour >= 12 && hour < 17) return "Good afternoon";
    if (hour >= 17 && hour < 21) return "Good evening";
    return "Good night";
  }, []);

  return (
    <View style={{ backgroundColor: theme.background, flex: 1, padding: 16, gap: 16 }}>
      {/* Greeting Card */}
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: theme.surface, borderRadius: 12, padding: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
        <Image source={{ uri: user?.avatar }} style={{ width: 40, height: 40, aspectRatio: 1, borderRadius: 20, borderColor: theme.border, borderWidth: 1, backgroundColor: theme.surface }} />
        <Text style={{ color: theme.text, fontSize: 22, fontWeight: 'bold', flex: 1 }}>
          {greeting}{user?.name ? `, ${user.name.split(' ')[0]}` : ''} <Text style={{ fontSize: 20 }}>👋</Text>
        </Text>
      </View>
      {/* Section Title */}
      <Text style={{ color: theme.text, fontSize: 18, fontWeight: '600', marginTop: 8, marginBottom: 4 }}>
        Activity
      </Text>
      {/* Loading State (initial load only) */}
      {feed.isLoading && (
        <View style={{ alignItems: 'center', marginVertical: 24 }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.muted, marginTop: 8 }}>Loading activity…</Text>
        </View>
      )}
      {/* Error State (muted, no red, no retry button) */}
      {feed.isError && !feed.isLoading && (
        <View style={{ alignItems: 'center', marginVertical: 12 }}>
          <Text style={{ color: theme.muted, fontSize: 14, textAlign: 'center' }}>{feed.error?.message || 'Failed to load activity.'}</Text>
        </View>
      )}
      {/* Activity List with Pull-to-Refresh */}
      {!feed.isLoading && (
        <FlashList
          data={feed.data}
          renderItem={({ item, index }: { item: CanvasActivityStreamItem, index: number }) => {
            const icon = getTypeIcon(item.type);
            const isUnread = item.read_state === false;
            const courseColor = item.course_id && colors.data ? colors.data[`course_${item.course_id}`] : undefined;
            const accentColor = courseColor || theme.primary;
            const courseName = item.course_id && courses.data ? courses.data.find((c: any) => c.id === item.course_id)?.name : undefined;
            return (
              <View style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                backgroundColor: theme.surface,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.10,
                shadowRadius: 6,
                elevation: 3,
                borderTopLeftRadius: index === 0 ? 12 : 0,
                borderTopRightRadius: index === 0 ? 12 : 0,
                borderBottomLeftRadius: index === (feed.data?.length || 0) - 1 ? 12 : 0,
                borderBottomRightRadius: index === (feed.data?.length || 0) - 1 ? 12 : 0,
                borderWidth: 1,
                borderLeftWidth: 0,
                borderRightWidth: 0,
                borderBottomWidth: 0,
                borderTopWidth: index === 0 ? 0 : 1,
                borderColor: theme.border,
                overflow: "hidden",
                padding: 16,
                gap: 12,
              }}>
                <MaterialCommunityIcons name={icon.name as any} size={28} color={accentColor} style={{ marginTop: 2 }} />
                <View style={{ flex: 1 }}>
                  {courseName && (
                    <Text style={{ color: theme.muted, fontSize: 12, fontWeight: '600', marginBottom: 2 }} numberOfLines={1}>{courseName}</Text>
                  )}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    {isUnread && <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: accentColor, marginRight: 4 }} />}
                    <Text style={{ color: theme.text, fontSize: 16, fontWeight: isUnread ? 'bold' : '600', flex: 1 }} numberOfLines={2}>{item.title}</Text>
                  </View>
                  <Text style={{ color: theme.muted, fontSize: 12, marginTop: 4 }}>{formatDate(item.created_at)}</Text>
                </View>
              </View>
            );
          }}
          contentContainerStyle={{ paddingBottom: 16 }}
          estimatedItemSize={100}
          onRefresh={feed.refetch}
          refreshing={feed.isFetching}
        />
      )}
    </View >
  );
}