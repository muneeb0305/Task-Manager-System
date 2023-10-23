using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TM.Buisness.Interfaces;
using TM.Buisness.Models;
using TM.WebApp.Filter;

namespace TM.WebApp.Controllers
{
    [Route("api/[controller]"), Authorize]

    public class CommentController : Controller
    {
        private readonly ICommentService commentService;

        public CommentController(ICommentService commentService)
        {
            this.commentService = commentService;
        }

        /// <summary>Get Comment by Id</summary>
        // GET: /api/comment/5
        [HttpGet("{CommentId}"), Authorize(Roles = "admin")]
        public async Task<IActionResult> Get(int CommentId)
        {
            var comments = await commentService.Get(CommentId);
            return Ok(comments);
        }

        /// <summary>Get Comment by TaskId</summary>
        // GET: /api/comment/task/5
        [HttpGet("task/{TaskId}")]
        public async Task<IActionResult> GetAllComments(int TaskId)
        {
            var comment = await commentService.GetByTask(TaskId);
            return Ok(comment);
        }

        /// <summary>Create Comment</summary>
        // POST: /api/comment/5
        [HttpPost("{TaskId}"), ModelStateFilter]
        public async Task<IActionResult> Create(int TaskId, [FromBody] CommentModel comment)
        {
            await commentService.Create(TaskId, comment);
            return Ok("Comment Added");
        }

        /// <summary>Delete Comment</summary>
        // Delete: api/comment/5
        [HttpDelete("{commentId}")]
        public async Task<IActionResult> Delete(int CommentId)
        {
            await commentService.Delete(CommentId);
            return Ok("Comment Removed");
        }

        /// <summary>Update Comment</summary>
        // Put: /api/comment/5
        [HttpPut("{commentId}"), ModelStateFilter]
        public async Task<IActionResult> Update(int commentId, [FromBody] CommentModel commentModel)
        {
            await commentService.Update(commentId, commentModel);
            return Ok("Comment Updated");
        }
    }
}
