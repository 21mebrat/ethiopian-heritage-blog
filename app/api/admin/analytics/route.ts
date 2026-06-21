import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/db";
import Post from "@/app/models/post";
import Category from "@/app/models/category";
import User from "@/app/models/user";
import Comment from "@/app/models/comment";

export async function GET() {
  try {
    await connectDB();

    // 1. CONTENT DISTRIBUTION (Donut Chart)
    // Aggregate posts by category
    const categoryStats = await Post.aggregate([
      {
        $group: {
          _id: "$category",
          postCount: { $sum: 1 },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },
      {
        $project: {
          name: "$categoryInfo.name",
          value: "$postCount",
        },
      },
    ]);

    // Calculate percentages
    const totalPosts = categoryStats.reduce((acc, curr) => acc + curr.value, 0);
    const distribution = categoryStats.map((cat) => ({
      name: cat.name,
      value: totalPosts > 0 ? Math.round((cat.value / totalPosts) * 100) : 0,
      color: getRandomColor(cat.name),
    }));

    // 2. ENGAGEMENT DATA (Area Chart)
    // Since we don't have a views_log, we aggregate views by day of the week based on post creation
    const engagement = await Post.aggregate([
        {
          $group: {
            _id: { $dayOfWeek: "$createdAt" },
            value: { $sum: "$views" },
          },
        },
        { $sort: { "_id": 1 } }
    ]);
    
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const engagementData = days.map((day, index) => {
        const found = engagement.find(e => e._id === (index + 1));
        return {
            day,
            value: found ? found.value : 0
        };
    });

    // 3. RECENT ACTIVITY (Live Feed)
    const [latestPosts, latestUsers, latestComments] = await Promise.all([
      Post.find().sort({ createdAt: -1 }).limit(3).populate("author", "name"),
      User.find().sort({ createdAt: -1 }).limit(2).select("name email createdAt"),
      Comment.find().sort({ createdAt: -1 }).limit(3),
    ]);

    const activity = [
      ...latestPosts.map(p => ({
        id: `post-${p._id}`,
        type: "post",
        title: p.title,
        user: p.author?.name || "Anonymous",
        time: getTimeAgo(p.createdAt),
        color: "#d4a574"
      })),
      ...latestUsers.map(u => ({
        id: `user-${u._id}`,
        type: "user",
        title: "Joined the platform",
        user: u.name,
        time: getTimeAgo(u.createdAt),
        color: "#7a5a3a"
      })),
      ...latestComments.map(c => ({
        id: `comment-${c._id}`,
        type: "comment",
        title: c.content?.toString().substring(0, 30) + "...",
        user: c.user_info?.name || "Anonymous",
        time: getTimeAgo(c.createdAt),
        color: "#a67c52"
      }))
    ].sort((a, b) => 0.5 - Math.random()); // Mix them for a "live" feel

    return NextResponse.json({
      success: true,
      data: {
        distribution: distribution.length > 0 ? distribution : [{ name: "No Content", value: 100, color: "#222" }],
        engagement: engagementData,
        activity: activity.slice(0, 8)
      }
    });

  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return NextResponse.json({ success: false, message: "Server error" }, { status: 500 });
  }
}

function getRandomColor(name: string) {
  const colors = ["#d4a574", "#a67c52", "#7a5a3a", "#4d3a26", "#c28b5a", "#8c6239"];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getTimeAgo(date: Date) {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "Just now";
}
