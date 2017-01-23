const express = require('express');

const router = express.Router();

// Write your form and validations inside this route file.


// Add form validations in /signup for:
// Username: Required. Must be more than 6 characters, must start with a letter, and no punctuation.
// Password: Required. Must be more than 8 characters with atleast One letter, one number, and one special character (!?/.,')
// Email: Required. Must be formatted like an email, (something @ something . something)
// First Name: Required.
// Last Name: Required.
// Phone Number: Required. Must be a 10 digit number formatted like: 999-888-9898
//
// STRETCH: Hook up a database that you insert these values into after you've validated them.
// REMINDER: Don't store passwords in plain text.. Make sure you hash it first!

router.get('/', (req, res) => {
  // Handle initial rendering here.
  res.render('signup', {
    hasError: false,
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
  });
});

router.post('/', (req, res) => {
  const postInfo = checkPost(req); // Run error checking.

  if (!postInfo.hasError) {
    // Validations passed -- Submit into database and redirect.
    res.redirect('/');
  } else {
    res.render('signup', postInfo);
  }
});


// PRO-TIP: Write ALOT of functions to help you handle each little piece.
function checkPost(req) {
  const info = {};
  info.hasError = false;
  info.error = {};

  // Required Checks
  checkRequired(info, req);

  // Email Check
  checkEmail(info, req);

  // Username Check
  checkUsernameLength(info, req);
  checkUsernameCharacters(info, req);

  // Password Check
  checkPasswordLength(info, req);
  checkPasswordCharacters(info, req);
  checkPasswordSpecialCharacter(info, req);

  // Phone Check
  checkPhone(info, req);


  return info;
}

function checkEmail(info, req) {
  const str = req.body.email;
  let hasAt = false;
  let hasPeriod = false;

  for (let i = 1; i < str.length; i++) {
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
// Username must be more than 6 characters.
function checkUsernameLength(info, req) {
  const username = req.body.username;
  if (username.length > 5) {
    // info.username = req.body.username;
  } else {
    if (!info.error.username) {
      info.error.username = [];
    }
    info.hasError = true;
    info.error.username.push({ message: 'Username must be more than 6 characters' });
  }
}

// Username must start with a letter, and no punctuation.
function checkUsernameCharacters(info, req) {
  const username = req.body.username;
  if (username[0].match(/[a-zA-Z]/)) {
    if (username.match(/^\w+$/)) {
      info.username = username;
    } else {
      if (!info.error.username) {
        info.error.username = [];
      }
      info.hasError = true;
      info.error.username.push({ message: 'Username can only contain letters and numbers' });
    }
  } else {
    if (!info.error.username) {
      info.error.username = [];
    }
    info.hasError = true;
    info.error.username.push({ message: 'Username must start with a letter' });
  }
}

// Password: Required. Must be more than 8 characters with atleast One letter, one number, and one special character (!?/.,')
function checkPasswordLength(info, req) {
  const password = req.body.password;
  if (password.length >= 8) {
  } else {
    if (!info.error.password) {
      info.error.password = [];
    }
    info.hasError = true;
    info.error.password.push({ message: 'Password must be more than 8 characters long' });
  }
}

function checkPasswordCharacters(info, req) {
  const password = req.body.password;
  let letter = false;
  let number = false;
  for (let i = 0; i < password.length; i++) {
    if (password[i].match(/[a-zA-Z]/)) {
      letter = true;
    }
  }
  for (let i = 0; i < password.length; i++) {
    if (password[i].match(/[0-9]/)) {
      number = true;
    }
  }
  if (letter && !number) {
    if (!info.error.password) {
      info.error.password = [];
    }
    info.hasError = true;
    info.error.password.push({ message: 'Password must contain at least one number' });
  }
  if (!letter && number) {
    if (!info.error.password) {
      info.error.password = [];
    }
    info.hasError = true;
    info.error.password.push({ message: 'Password must contain at least one letter' });
  } else if (!letter && !number) {
    if (!info.error.password) {
      info.error.password = [];
    }
    info.hasError = true;
    info.error.password.push({ message: 'Password must contain at least one letter and at least one number' });
  }
}

function checkPasswordSpecialCharacter(info, req) {
  const password = req.body.password;
  let specialCharacter = false;
  for (let i = 0; i < password.length; i++) {
    if (password[i].match(/[^a-zA-Z0-9]/)) {
      specialCharacter = true;
    }
  }
  if (specialCharacter) {
    info.password = req.body.password;
  } else {
    if (!info.error.password) {
      info.error.password = [];
    }
    info.hasError = true;
    info.error.password.push({ message: 'Password must contain at least one special character' });
  }
}

function checkPhone(info, req) {
  const phone = req.body.phone;
  if (phone.match(/[0-9][0-9][0-9][-][0-9][0-9][0-9][-][0-9][0-9][0-9][0-9]/)) {
    info.phone = req.body.phone;
  } else {
    if (!info.error.phone) {
      info.error.phone = [];
    }
    info.hasError = true;
    info.error.phone.push({ message: 'Phone number must be in format: 123-456-7890' });
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


// Add form validations in /signup for:
// Email: Required. Must be formatted like an email, (something @ something . something)
// First Name: Required.
// Last Name: Required.
// Phone Number: Required. Must be a 10 digit number formatted like: 999-888-9898

module.exports = router;
