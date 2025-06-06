/**
 * Shared base type for all Canvas activity stream items, per Canvas API docs.
 * https://canvas.instructure.com/doc/api/users.html#method.users.activity_stream
 */
export type CanvasActivityStreamBase = {
  id: number;
  title: string;
  message: string;
  type: string;
  read_state: boolean;
  context_type: 'course' | 'group';
  course_id?: number | null;
  group_id?: number | null;
  html_url: string;
  created_at: string;
  updated_at: string;
};

export type CanvasActivityStreamItem =
  | (CanvasActivityStreamBase & {
      type: 'DiscussionTopic';
      discussion_topic_id: number;
      total_root_discussion_entries: number;
      require_initial_post: boolean;
      user_has_posted: boolean;
      root_discussion_entries?: any;
    })
  | (CanvasActivityStreamBase & {
      type: 'Announcement';
      announcement_id: number;
      total_root_discussion_entries: number;
      require_initial_post: boolean;
      user_has_posted: boolean | null;
      root_discussion_entries?: any;
    })
  | (CanvasActivityStreamBase & {
      type: 'Conversation';
      conversation_id: number;
      private: boolean;
      participant_count: number;
    })
  | (CanvasActivityStreamBase & {
      type: 'Message';
      message_id: number;
      notification_category: string;
    })
  | (CanvasActivityStreamBase & {
      type: 'Submission';
      // Submission type includes nested Course and Assignment data, which can be typed as any for now
      [key: string]: any;
    })
  | (CanvasActivityStreamBase & {
      type: 'Conference';
      web_conference_id: number;
    })
  | (CanvasActivityStreamBase & {
      type: 'Collaboration';
      collaboration_id: number;
    })
  | (CanvasActivityStreamBase & {
      type: 'AssessmentRequest';
      assessment_request_id: number;
    })
  | (CanvasActivityStreamBase & {
      // fallback for unknown types
      type: string;
      [key: string]: any;
    });

/**
 * Fetches the activity stream (feed) for the current user from Canvas.
 * https://canvas.instructure.com/doc/api/users.html#method.users.activity_stream
 * @param domain Canvas domain
 * @param token Canvas API token
 * @returns Promise resolving to an array of activity stream items
 */
export default async function getFeed(
  domain: string,
  token: string
): Promise<CanvasActivityStreamItem[]> {
  const response = await fetch(
    `https://${domain}/api/v1/users/self/activity_stream?only_active_courses=true`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  if (!response.ok) throw new Error(await response.text());
  return response.json();
}
