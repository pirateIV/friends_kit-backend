const express = require('express')
const authMiddleware = require('../middleware/authMiddleware')

router.get('/getAllPosts', authMiddleware, async(req, res) => {
  const userId = req.id;

  res.json(req.body)
})

router.get('/getAllPosts', authMiddleware, async(req, res) => {
  const userId = req.id;

  res.json(req.body)
})

router.get('/getAllPosts', authMiddleware, async(req, res) => {
  const userId = req.id;

  res.json(req.body)
})

router.get('/getAllPosts', authMiddleware, async(req, res) => {
  const userId = req.id;

  res.json(req.body)
})