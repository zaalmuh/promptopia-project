'use client';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Profile from '@components/Profile';
import { useSession } from 'next-auth/react';

function MyProfile() {
  const { data: session } = useSession();
  const [posts, setPosts] = useState([]);
  const router = useRouter();
  useEffect(() => {
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${session?.user.id}/posts`);
      const data = await response.json();
      setPosts(data);
    };

    if (session?.user.id) fetchPosts();
  }, []);

  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`);
  };

  const handleDelete = async (post) => {
    const hasConfirmed = confirm('Are you sure?');

    if (hasConfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, {
          method: 'DELETE',
        });

        const filteredPost = posts.filter((p) => post._id !== p._id);
        setPosts(filteredPost);
      } catch (error) {}
    }
  };
  return <Profile name="My" desc="Welcome to your personalized profile page" data={posts} handleEdit={handleEdit} handleDelete={handleDelete} />;
}

export default MyProfile;
