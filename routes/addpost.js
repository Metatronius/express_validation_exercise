const express = require('express');

const router = express.Router();

function checkEmail(info, req) {
  const str = req.body.email;
  let hasAt = false;
  let hasPeriod = false;

  for (let i = 1; i < str.length; i += 1) {
    if (str[i] === '@' || hasAt) {
      if (hasAt && str[i] === '.') {
        hasPeriod = true;
      }
      hasAt = true;
    }
  }

  if (hasAt && hasPeriod) {
    info.email = req.body.email;
  } else {
    if (!info.error.email) {
      info.error.email = [];
    }
    info.hasError = true;
    info.error.email.push({ message: 'email is malformed.' });
  }
}

function checkRequired(info, req) {
  for (const item in req.body) {
    info[item] = req.body[item];
    if (req.body[item].length <= 0) {
      if (!info.error[item]) {
        info.error[item] = [];
      }
      info.hasError = true;
      info.error[item].push({ message: `${item} is required.` });
    }
  }
}

function checkPost(req) {
  const info = {};
  info.hasError = false;
  info.error = {};

  checkRequired(info, req);

  checkEmail(info, req);

  return info;
}


router.get('/', (req, res) => {
  res.render('add_post', {
    hasError: false,
    title: '',
    author: '',
    email: '',
    description: '',
  });
});
router.post('/', (req, res) => {
  const postInfo = checkPost(req); 

  if (!postInfo.hasError) {
    res.redirect('/');
  } else {
    res.render('add_post', postInfo);
  }
});


module.exports = router;
