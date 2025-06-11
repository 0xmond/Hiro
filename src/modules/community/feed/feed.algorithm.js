import { User } from "../../../db/models/user.model.js";
import { Post } from "../../../db/models/post.model.js";
import { React } from "../../../db/models/react.model.js";
import { Comment } from "../../../db/models/comment.model.js";

class RankingService {
  // calculate engagement score (likes, comments, shares)
  calculateEngagement(post) {
    return post.reacts.length + 2 * post.comments.length + 3 * post.shareCount;
  }

  // calculate relevance (matching tags with user interests)
  calculateRelevance(post, interests) {
    if (!interests || interests.length === 0) return 0;
    const matchingTags = post.tags.filter((tag) => interests.includes(tag));
    return matchingTags.length / interests.length;
  }

  // calculate recency (exponential decay)
  calculateRecency(post) {
    const hoursSincePost = (new Date() - post.createdAt) / (1000 * 60 * 60);
    const decayRate = 0.1; // determines how aggressively older posts are losing relevance
    return Math.exp(-decayRate * hoursSincePost);
  }

  // final ranking score (weighted sum)
  calculateRankingScore(post, interests) {
    const engagementWeight = 0.5;
    const relevanceWeight = 0.3;
    const recencyWeight = 0.2;

    const engagement = this.calculateEngagement(post);
    const relevance = this.calculateRelevance(post, interests);
    const recency = this.calculateRecency(post);

    return (
      engagementWeight * engagement +
      relevanceWeight * relevance +
      recencyWeight * recency
    );
  }

  async getRankedPostsForEmployee(interests, user, page = 1, limit = 10) {
    // pre-filter posts (only those with matching tags & recent)
    const posts = await Post.find({
      tags: { $in: interests },
      publisherId: {
        $in: [...user.friendsIds, user.profileId, ...user.followingIds],
      },
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      archived: false,
    })
      // .skip((page - 1) * limit)
      // .limit(limit)
      .populate([
        {
          path: "publisher",
          select:
            "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        },
        {
          path: "comments",
          populate: [
            {
              path: "user",
              select:
                "profilePicture.secure_url username firstName lastName companyName profileId -_id",
            },
          ],
        },
        {
          path: "reacts",
          select: "_id react userId",
          populate: [
            {
              path: "user",
              select:
                "profilePicture.secure_url username firstName lastName companyName profileId -_id",
            },
          ],
        },
        {
          path: "sharedFrom",
          populate: {
            path: "publisher",
            select:
              "profilePicture.secure_url username firstName lastName companyName profileId -_id",
          },
        },
      ])
      .lean();

    // rank the filtered posts
    const rankedPosts = posts
      .map((post) => ({
        post,
        score: this.calculateRankingScore(post, interests),
      }))
      .sort((a, b) => b.score - a.score);

    return rankedPosts;
  }

  async getRankedPostsForCompany(page = 1, limit = 10) {
    // pre-filter posts (only those with matching tags & recent)
    const posts = await Post.find({
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
      archived: false,
    })
      // .skip((page - 1) * limit)
      // .limit(limit)
      .populate([
        {
          path: "publisher",
          select:
            "profilePicture.secure_url username firstName lastName companyName profileId -_id",
        },
        {
          path: "comments",
          select: "_id",
        },
        {
          path: "reacts",
          select: "_id",
        },
        {
          path: "sharedFrom",
          populate: {
            path: "publisher",
            select:
              "profilePicture.secure_url username firstName lastName companyName profileId -_id",
          },
        },
      ])
      .lean();

    // rank the filtered posts
    const rankedPosts = posts
      .map((post) => ({
        post,
        score: this.calculateRankingScore(post),
      }))
      .sort((a, b) => b.score - a.score);

    return rankedPosts;
  }
}

export default new RankingService();
