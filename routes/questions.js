const User = require("../models/user"); // Import User Model Schema
const Question = require("../models/question");
const jwt = require("jsonwebtoken"); // Compact, URL-safe means of representing claims to be transferred between two parties.
const config = require("../config/database"); // Import database configuration

module.exports = router => {
  router.post("/newQuestion", (req, res) => {
    if (!req.body.title) {
      res.json({ success: false, message: "Question title is required." });
    } else {
      if (!req.body.body) {
        res.json({ success: false, message: "Question body is required." });
      } else {
        if (!req.body.createdBy) {
          res.json({
            success: false,
            message: "Question creator is required."
          });
        } else {
          const question = new Question({
            title: req.body.title,
            body: req.body.body,
            createdBy: req.body.createdBy
          });

          question.save(err => {
            if (err) {
              if (err.errors) {
                if (err.errors.title) {
                  res.json({
                    success: false,
                    message: err.errors.title.message
                  });
                } else {
                  if (err.errors.body) {
                    res.json({
                      success: false,
                      message: err.errors.body.message
                    });
                  } else {
                    res.json({ success: false, message: err });
                  }
                }
              } else {
                res.json({ success: false, message: err });
              }
            } else {
              res.json({ success: true, message: "Question saved!" });
            }
          });
        }
      }
    }
  });

  router.get("/allQuestions", (req, res) => {
    Question.find({}, (err, questions) => {
      if (err) {
        res.json({ success: false, message: err });
      } else {
        if (!questions) {
          res.json({ success: false, message: "No questions found." });
        } else {
          console.log(questions);
          res.json({ success: true, questions: questions });
        }
      }
    }).sort({ _id: -1 });
  });

  router.get("/singleQuestion/:id", (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: "No question ID was provided." });
    } else {
      Question.findOne({ _id: req.params.id }, (err, question) => {
        if (err) {
          res.json({ success: false, message: "Not a valid question id" });
        } else {
          if (!question) {
            res.json({ success: false, message: "Question not found." });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Unable to authenticate user"
                  });
                } else {
                  if (user.username !== question.createdBy) {
                    res.json({
                      success: false,
                      message: "You are not authorized to edit this question."
                    });
                  } else {
                    res.json({ success: true, question: question });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put("/updateQuestion", (req, res) => {
    if (!req.body._id) {
      res.json({ success: false, message: "No question id provided" });
    } else {
      Question.findOne({ _id: req.body._id }, (err, question) => {
        if (err) {
          res.json({ success: false, message: "Not a valid question id" });
        } else {
          if (!question) {
            res.json({ success: false, message: "Question id was not found." });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Unable to authenticate user."
                  });
                } else {
                  if (user.username !== question.createdBy) {
                    res.json({
                      success: false,
                      message:
                        "You are not authorized to edit this question post."
                    });
                  } else {
                    question.title = req.body.title;
                    question.body = req.body.body;
                    question.save(err => {
                      if (err) {
                        if (err.errors) {
                          res.json({
                            success: false,
                            message: "Please ensure form is filled out properly"
                          });
                        } else {
                          res.json({ success: false, message: err });
                        }
                      } else {
                        res.json({
                          success: true,
                          message: "Question Updated!"
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.delete("/deleteQuestion/:id", (req, res) => {
    if (!req.params.id) {
      res.json({ success: false, message: "No id provided" });
    } else {
      Question.findOne({ _id: req.params.id }, (err, question) => {
        if (err) {
          res.json({ success: false, message: "Invalid id" });
        } else {
          if (!question) {
            res.json({ success: false, messasge: "Question was not found" });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: err });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Unable to authenticate user."
                  });
                } else {
                  if (user.username !== question.createdBy) {
                    res.json({
                      success: false,
                      message: "You are not authorized to delete this Question"
                    });
                  } else {
                    question.remove(err => {
                      if (err) {
                        res.json({ success: false, message: err });
                      } else {
                        res.json({
                          success: true,
                          message: "Question deleted!"
                        });
                      }
                    });
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put("/likeQuestion", (req, res) => {
    if (!req.body.id) {
      res.json({ success: false, message: "No id was provided." });
    } else {
      Question.findOne({ _id: req.body.id }, (err, question) => {
        if (err) {
          res.json({ success: false, message: "Invalid question id" });
        } else {
          if (!question) {
            res.json({
              success: false,
              message: "That question was not found."
            });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: "Something went wrong." });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Could not authenticate user."
                  });
                } else {
                  if (user.username === question.createdBy) {
                    res.json({
                      success: false,
                      messagse: "Cannot like your own post."
                    });
                  } else {
                    if (question.likedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: "You already liked this post."
                      });
                    } else {
                      if (question.dislikedBy.includes(user.username)) {
                        question.dislikes--;
                        const arrayIndex = question.dislikedBy.indexOf(
                          user.username
                        );
                        question.dislikedBy.splice(arrayIndex, 1);
                        question.likes++;
                        question.likedBy.push(user.username);

                        question.save(err => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Question liked!"
                            });
                          }
                        });
                      } else {
                        question.likes++;
                        question.likedBy.push(user.username);

                        question.save(err => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                            console.log(err);
                          } else {
                            res.json({
                              success: true,
                              message: "Question liked!"
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.put("/dislikeQuestion", (req, res) => {
    if (!req.body.id) {
      res.json({ success: false, message: "No id was provided." }); // Return error message
    } else {
      Question.findOne({ _id: req.body.id }, (err, question) => {
        if (err) {
          res.json({ success: false, message: "Invalid question id" });
        } else {
          if (!question) {
            res.json({
              success: false,
              message: "That question was not found."
            });
          } else {
            User.findOne({ _id: req.decoded.userId }, (err, user) => {
              if (err) {
                res.json({ success: false, message: "Something went wrong." });
              } else {
                if (!user) {
                  res.json({
                    success: false,
                    message: "Could not authenticate user."
                  });
                } else {
                  if (user.username === question.createdBy) {
                    res.json({
                      success: false,
                      messagse: "Cannot dislike your own post."
                    });
                  } else {
                    if (question.dislikedBy.includes(user.username)) {
                      res.json({
                        success: false,
                        message: "You already disliked this post."
                      });
                    } else {
                      if (question.likedBy.includes(user.username)) {
                        question.likes--;
                        const arrayIndex = question.likedBy.indexOf(
                          user.username
                        );
                        question.likedBy.splice(arrayIndex, 1);
                        question.dislikes++;
                        question.dislikedBy.push(user.username);

                        question.save(err => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Question disliked!"
                            });
                          }
                        });
                      } else {
                        question.dislikes++;
                        question.dislikedBy.push(user.username);

                        question.save(err => {
                          if (err) {
                            res.json({
                              success: false,
                              message: "Something went wrong."
                            });
                          } else {
                            res.json({
                              success: true,
                              message: "Question disliked!"
                            });
                          }
                        });
                      }
                    }
                  }
                }
              }
            });
          }
        }
      });
    }
  });

  router.post("/comment", (req, res) => {
    if (!req.body.comment) {
      res.json({ success: false, message: "No comment provided" });
    } else {
      if (!req.body.id) {
        res.json({ success: false, message: "No id was provided" });
      } else {
        Question.findOne({ _id: req.body.id }, (err, question) => {
          if (err) {
            res.json({ success: false, message: "Invalid question id" });
          } else {
            if (!question) {
              res.json({ success: false, message: "Question not found." });
            } else {
              User.findOne({ _id: req.decoded.userId }, (err, user) => {
                if (err) {
                  res.json({ success: false, message: "Something went wrong" });
                } else {
                  if (!user) {
                    res.json({ success: false, message: "User not found." });
                  } else {
                    question.comments.push({
                      comment: req.body.comment,
                      commentator: user.username
                    });

                    question.save(err => {
                      if (err) {
                        res.json({
                          success: false,
                          message: "Something went wrong."
                        });
                      } else {
                        res.json({ success: true, message: "Comment saved" });
                      }
                    });
                  }
                }
              });
            }
          }
        });
      }
    }
  });

  return router;
};
