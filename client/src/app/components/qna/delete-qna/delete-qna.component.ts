import { Component, OnInit } from "@angular/core";
import { QnaService } from "../../../services/qna.service";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-delete-qna",
  templateUrl: "./delete-qna.component.html",
  styleUrls: ["./delete-qna.component.css"]
})
export class DeleteQuestionComponent implements OnInit {
  message;
  messageClass;
  foundQna = false;
  processing = false;
  qna;
  currentUrl;

  constructor(
    private qnaService: QnaService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  deleteQna() {
    this.processing = true;

    this.qnaService.deleteQuestion(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;

        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 2000);
      }
    });
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.qnaService.getSingleQuestion(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      } else {
        this.qna = {
          title: data.question.title,
          body: data.question.body,
          createdBy: data.question.createdBy,
          createdAt: data.question.createdAt
        };
        this.foundQna = true;
      }
    });
  }
}
