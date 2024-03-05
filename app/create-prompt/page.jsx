'use client';
import Form from '@components/Form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

function CreatePrompt() {
  const router = useRouter();
  const { data: session } = useSession();

  const [submitting, setSubmitting] = useState(false);
  const [post, setPost] = useState({
    prompt: '',
    tag: '',
  });
  const createPrompt = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const response = await fetch('/api/prompt/new', {
        method: 'POST',
        body: JSON.stringify({ prompt: post.prompt, userId: session?.user.id, tag: post.tag }),
      });

      if (response.ok) {
        console.log('ok');
        router.push('/');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return <Form type="Create" setPost={setPost} post={post} submitting={submitting} handleSubmit={createPrompt} />;
}

export default CreatePrompt;
