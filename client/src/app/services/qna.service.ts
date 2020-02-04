import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Http, Headers, RequestOptions } from "@angular/http";

@Injectable()
export class QnaService {
  options;
  domain = this.authService.domain;

  constructor(private authService: AuthService, private http: Http) {}

  createAuthenticationHeaders() {
    this.authService.loadToken();

    this.options = new RequestOptions({
      headers: new Headers({
        "Content-Type": "application/json", // Format set to JSON
        authorization: this.authService.authToken // Attach token
      })
    });
  }

  newQuestion(question) {
    this.createAuthenticationHeaders();
    return this.http
      .post(this.domain + "questions/newQuestion", question, this.options)
      .map(res => res.json());
  }

  getAllQuestions() {
    this.createAuthenticationHeaders();
    return this.http
      .get(this.domain + "questions/allQuestions", this.options)
      .map(res => res.json());
  }

  getSingleQuestion(id) {
    this.createAuthenticationHeaders();
    return this.http
      .get(this.domain + "questions/singleQuestion/" + id, this.options)
      .map(res => res.json());
  }

  editQuestion(question) {
    this.createAuthenticationHeaders();
    return this.http
      .put(this.domain + "questions/updateQuestion/", question, this.options)
      .map(res => res.json());
  }

  deleteQuestion(id) {
    this.createAuthenticationHeaders();
    return this.http
      .delete(this.domain + "questions/deleteQuestion/" + id, this.options)
      .map(res => res.json());
  }

  likeQuestion(id) {
    const qnaData = { id: id };
    return this.http
      .put(this.domain + "questions/likeQuestion/", qnaData, this.options)
      .map(res => res.json());
  }

  dislikeQuestion(id) {
    const qnaData = { id: id };
    return this.http
      .put(this.domain + "questions/dislikeQuestion/", qnaData, this.options)
      .map(res => res.json());
  }

  postComment(id, comment) {
    this.createAuthenticationHeaders();

    const qnaData = {
      id: id,
      comment: comment
    };
    return this.http
      .post(this.domain + "questions/comment", qnaData, this.options)
      .map(res => res.json());
  }
}
