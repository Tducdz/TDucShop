import { Comment } from "@/app/product/[id]/page";
import { IoTimeOutline } from "react-icons/io5";
import { CgDetailsMore } from "react-icons/cg";

const CommentCard = ({ comment }: { comment: Comment }) => {
  return (
    <div className="card-comment">
      <span className="comment-name">{comment.user_name}</span>
      <span className="comment-time">
        <IoTimeOutline />
        <i>
          {new Date(comment.create_at).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </i>
      </span>
      <p className="comment-text">
        <CgDetailsMore /> {comment.comment}
      </p>
    </div>
  );
};

export default CommentCard;
