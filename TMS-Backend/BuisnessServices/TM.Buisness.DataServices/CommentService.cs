using AutoMapper;
using Microsoft.EntityFrameworkCore;
using TM.Buisness.CustomErrors;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.Data.Interfaces;
using TM.Data.Models;

namespace TM.Buisness.DataServices
{
    public class CommentService : Errors, ICommentService
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IMapper mapper;

        public CommentService(IUnitOfWork unitOfWork, IMapper mapper)
        {
            this.unitOfWork = unitOfWork;
            this.mapper = mapper;
        }

        //Create Comment
        public async Task Create(int TaskId, CommentModel commentModel)
        {
            var getTask = await unitOfWork.TaskRepository.Get(TaskId);

            //Not Found
            NotFound(getTask == null, "Task Not Found");

            //Add Comment
            var commentEntity = mapper.Map<Comment>(commentModel);
            commentEntity.CreatedDate = DateTime.Now;
            commentEntity.TaskId = TaskId;
            var addComment = await unitOfWork.CommentRepository.Add(commentEntity);

            if (addComment)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To create comment");
            }
        }

        //Delete Comment
        public async Task Delete(int Commentid)
        {
            var removeComment = await unitOfWork.CommentRepository.Get(Commentid);

            //Not Found
            NotFound(removeComment == null, "Comment Not Found");

            //Delete
            var commentToRemove = unitOfWork.CommentRepository.Remove(removeComment!);
            if (commentToRemove)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To delete comment");
            }
        }

        //Update Comment
        public async Task Update(int commentId, CommentModel commentModel)
        {
            var commentToUpdate = await unitOfWork.CommentRepository.Get(commentId);

            //Not Found
            NotFound(commentToUpdate == null, "Comment Not Found");

            //Update
            commentToUpdate!.CommentText = commentModel.CommentText;
            commentToUpdate.UserId = commentModel.UserId;
            commentToUpdate.CreatedDate = DateTime.Now;
            var commentEntity = mapper.Map<Comment>(commentToUpdate);
            var updatedComment = unitOfWork.CommentRepository.Update(commentEntity);
            if (updatedComment)
            {
                await unitOfWork.Commit();
            }
            else
            {
                ThrowFailureError("Failed To update comment");
            }
        }

        //Get All Comments
        public async Task<object> Get(int CommentId)
        {
            var allComments = await unitOfWork.CommentRepository.Find(c => c.CommentId == CommentId).Include(c => c.Task).FirstOrDefaultAsync();
            var commentDetail = new
            {
                id = allComments!.CommentId,
                taskName = allComments.Task.TaskName,
                taskDescription = allComments.Task.TaskDescription,
                comment = allComments.CommentText,
                createdAt = allComments.CreatedDate.ToString("yyyy-MM-dd")
            };
            return commentDetail;
        }

        //Get all Comments by Task ID
        public async Task<object> GetByTask(int TaskId)
        {
            var taskExist = await unitOfWork.TaskRepository.Get(TaskId);

            //Not Found
            NotFound(taskExist == null, $"Invalid Task ID: {TaskId}");

            var allComments = await unitOfWork.CommentRepository.Find(c => c.TaskId == TaskId).Include(c => c.User).ToListAsync();
            var commentDetail = allComments.Select(c => new
            {
                id = c.CommentId,
                taskName = c.Task.TaskName,
                taskDescription = c.Task.TaskDescription,
                comment = c.CommentText,
                createdBy = c.User.UserName,
                createdAt = c.CreatedDate.ToString("yyyy-MM-dd")
            });
            return commentDetail;
        }
        public Task Create(CommentModel entity)
        {
            ThrowFailureError("Give Task Id also");
            return Task.CompletedTask;
        }

        public Task<object> Get()
        {
            throw new NotImplementedException();
        }
    }
}
