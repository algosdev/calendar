import React, { useState } from 'react'
import AddCommentDrawer from './AddCommentDrawer'
import Comment from './Comment'

export default function CommentList({ comments, trains, afterSubmit }) {
  const [commentId, setCommentId] = useState('')
  return (
    <>
      {comments?.data?.comments?.length
        ? comments?.data?.comments?.map((el, key) => (
            <Comment
              onEdit={(comment) => {
                setCommentId(comment)
              }}
              key={key}
              data={el}
              trains={trains?.data?.trains}
            />
          ))
        : 'No comment'}
      <AddCommentDrawer
        open={commentId}
        setOpen={setCommentId}
        trains={trains}
        afterSubmit={afterSubmit}
      />
    </>
  )
}
