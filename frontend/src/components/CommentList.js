const CommentList = ({ comments }) => {
  if (!comments.length) return <h4>no comments</h4>;

  return (
    <div>
      <ul>
        {comments.map((comment, i) => (
          <li key={i}>{comment}</li>
        ))}
      </ul>
    </div>
  );
};

export default CommentList;
