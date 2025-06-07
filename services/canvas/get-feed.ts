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
 * Fetches the activity stream (feed) for the current user from Canvas, with pagination support.
 * @param domain Canvas domain
 * @param token Canvas API token
 * @param nextUrl Optional: full URL for the next page (from Link header)
 * @returns Promise resolving to { items, nextUrl }
 */
export default async function getFeed(
  domain: string,
  token: string,
  nextUrl?: string
): Promise<{ items: CanvasActivityStreamItem[]; nextUrl?: string }> {
  const url = nextUrl || `https://${domain}/api/v1/users/self/activity_stream?only_active_courses=true&per_page=20`;
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(await response.text());
  const items = await response.json();
  // Parse Link header for next page
  const link = response.headers.get('Link');
  let nextPageUrl: string | undefined = undefined;
  if (link) {
    const match = link.match(/<([^>]+)>; rel="next"/);
    if (match) {
      nextPageUrl = match[1];
    }
  }
  return { items, nextUrl: nextPageUrl };
}
