import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormBuilder,
  Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth.service";
import { QnaService } from "../../services/qna.service";

@Component({
  selector: "app-qna",
  templateUrl: "./qna.component.html",
  styleUrls: ["./qna.component.css"]
})
export class QnaComponent implements OnInit {
  messageClass;
  message;
  newPost = false;
  loadingQuestions = false;
  form;
  commentForm;
  processing = false;
  username;
  qnaPosts;
  newComment = [];
  enabledComments = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private qnaService: QnaService
  ) {
    this.createNewQuestionForm();
    this.createCommentForm();
  }

  createNewQuestionForm() {
    this.form = this.formBuilder.group({
      title: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(50),
          Validators.minLength(5),
          this.alphaNumericValidation
        ])
      ],

      body: [
        "",
        Validators.compose([
          Validators.required,
          Validators.maxLength(500),
          Validators.minLength(5)
        ])
      ]
    });
  }

  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: [
        "",
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(200)
        ])
      ]
    });
  }

  enableCommentForm() {
    this.commentForm.get("comment").enable();
  }

  disableCommentForm() {
    this.commentForm.get("comment").disable();
  }

  enableFormNewQuestionForm() {
    this.form.get("title").enable();
    this.form.get("body").enable();
  }

  disableFormNewQuestionForm() {
    this.form.get("title").disable();
    this.form.get("body").disable();
  }

  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/);

    if (regExp.test(controls.value)) {
      return null;
    } else {
      return { alphaNumericValidation: true };
    }
  }

  newQuestionForm() {
    this.newPost = true;
  }

  reloadQna() {
    this.loadingQuestions = true;
    this.getAllQuestions();
    setTimeout(() => {
      this.loadingQuestions = false;
    }, 4000);
  }

  draftComment(id) {
    this.commentForm.reset();
    this.newComment = [];
    this.newComment.push(id);
  }

  cancelSubmission(id) {
    const index = this.newComment.indexOf(id);
    this.newComment.splice(index, 1);
    this.commentForm.reset();
    this.enableCommentForm();
    this.processing = false;
  }

  onQuestionSubmit() {
    this.processing = true;
    this.disableFormNewQuestionForm();

    const question = {
      title: this.form.get("title").value,
      body: this.form.get("body").value,
      createdBy: this.username
    };

    this.qnaService.newQuestion(question).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
        this.enableFormNewQuestionForm();
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;
        this.getAllQuestions();

        setTimeout(() => {
          this.newPost = false;
          this.processing = false;
          this.message = false;
          this.form.reset();
          this.enableFormNewQuestionForm();
        }, 2000);
      }
    });
  }

  goBack() {
    window.location.reload();
  }

  getAllQuestions() {
    this.qnaService.getAllQuestions().subscribe(data => {
      console.log(data);
      this.qnaPosts = data.questions;
    });
  }

  likeQuestion(id) {
    console.log(id);
    this.qnaService.likeQuestion(id).subscribe(data => {
      this.getAllQuestions();
    });
  }

  dislikeQuestion(id) {
    this.qnaService.dislikeQuestion(id).subscribe(data => {
      this.getAllQuestions();
    });
  }

  postComment(id) {
    this.disableCommentForm();
    this.processing = true;
    const comment = this.commentForm.get("comment").value;

    this.qnaService.postComment(id, comment).subscribe(data => {
      this.getAllQuestions();
      const index = this.newComment.indexOf(id);
      this.newComment.splice(index, 1);
      this.enableCommentForm();
      this.commentForm.reset();
      this.processing = false;
      if (this.enabledComments.indexOf(id) < 0) this.expand(id);
    });
  }

  expand(id) {
    this.enabledComments.push(id);
  }

  collapse(id) {
    const index = this.enabledComments.indexOf(id);
    this.enabledComments.splice(index, 1);
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if (profile.user) {
        this.username = profile.user.username;
      } else {
        this.username = null;
      }
    });

    this.getAllQuestions();
  }
}
