var express = require('express'),
    Post = require('../models/Post'),
    Comment = require('../models/comment');
var router = express.Router();

/* GET posts listing. */
router.get('/', function(req, res, next) {
  Post.find({}, function(err, docs) {
    if (err) {
      return next(err);
    }
    res.render('posts/index', {posts: docs});
  });
});


router.get('/new', function(req, res, next) {
  res.render('posts/new');
});


router.get('/signin', function(req, res, next) {
  res.render('posts/signin');
});

router.post('/', function(req, res, next) {
  var post = new Post({
    title: req.body.title,
    email: req.body.email,
    content: req.body.content
  });

  post.save(function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

router.delete('/:id', function(req, res, next) { // 지워줌
  Post.findOneAndRemove({_id: req.params.id}, function(err) {
    if (err) {
      return next(err);
    }
    res.redirect('/posts');
  });
});

router.get('/:id/edit', function(req, res, next) { // 수정을 클릭했을때
  Post.findById(req.params.id, function(err, post) { // id를 찾고
    if (err) {
      return next(err);
    }
    res.render('posts/edit', {post: post}); //그 id를 가진 post를 넘김
  });
});

router.get('/:id/cedit', function(req, res, next) { // 수정을 클릭했을때
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('posts/cedit', {post: post, comments: comments});
    });
  });
});

router.get('/:id', function(req, res, next) {
  Post.findById(req.params.id, function(err, post) {
    if (err) {
      return next(err);
    }
    Comment.find({post: post.id}, function(err, comments) {
      if (err) {
        return next(err);
      }
      res.render('posts/show', {post: post, comments: comments});
    });
  });
});

router.put('/:id', function(req, res, next) { // 수정 후 저장을 클릭했을때
  Post.findById({_id: req.params.id}, function(err, post) {
    if (err) {
      return next(err);
    }
    /*수정 후 저장*/
    post.title = req.body.title;
    post.email = req.body.email;
    post.content = req.body.content;

    post.save(function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts');
    });
  });
});

router.post('/:id/comments', function(req, res, next) {
  var comment = new Comment({
    post: req.params.id,
    email: req.body.email,
    content: req.body.content
  });

  comment.save(function(err) {
    if (err) {
      return next(err);
    }
    Post.findByIdAndUpdate(req.params.id, {$inc: {numComment: 1}}, function(err) {
      if (err) {
        return next(err);
      }
      res.redirect('/posts/' + req.params.id);
    });
  });
});

router.post('/:id/cedita', function(req, res, next) {
  Post.findById({_id: req.params.id}, function(err, comment) {
    if (err) {
      return next(err);
    }

      res.redirect('/posts/' + req.params.id);

  });
});

module.exports = router;
