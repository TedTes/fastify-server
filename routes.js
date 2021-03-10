const { json } = require('express');
const mongoose = require('mongoose');
const Article = mongoose.model('Article');

module.exports = routes => {
  routes.get('/api/articles', async (req, reply) => {
    const articles = await Article.find().cache({ expire: 10 });
    reply.send(articles);
  });

  routes.post('/api/articles', async (req, reply) => {
      
    const { title, author, content } = JSON.parse(req.body);

    if (!title || !author || !content) {
      return reply.status(400).send('Missing title, author, or content')
    }

    const article = new Article({
      title,
      author,
      content
    });

    try {
      await article.save();
      reply.send(article);
    } catch (err) {
      reply.status(400).send(err.message);
    }
  });
};