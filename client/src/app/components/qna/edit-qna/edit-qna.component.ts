import { Component, OnInit } from "@angular/core";
import { Location } from "@angular/common";
import { ActivatedRoute, Router } from "@angular/router";
import { QnaService } from "../../../services/qna.service";

@Component({
  selector: "app-edit-qna",
  templateUrl: "./edit-qna.component.html",
  styleUrls: ["./edit-qna.component.css"]
})
export class EditQuestionComponent implements OnInit {
  message;
  messageClass;
  question;
  processing = false;
  currentUrl;
  loading = true;

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private qnaService: QnaService,
    private router: Router
  ) {}

  updateQuestionSubmit() {
    this.processing = true;

    this.qnaService.editQuestion(this.question).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
        this.processing = false;
      } else {
        this.messageClass = "alert alert-success";
        this.message = data.message;

        setTimeout(() => {
          this.router.navigate(["/"]);
        }, 2000);
      }
    });
  }

  goBack() {
    this.location.back();
  }

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params;

    this.qnaService.getSingleQuestion(this.currentUrl.id).subscribe(data => {
      if (!data.success) {
        this.messageClass = "alert alert-danger";
        this.message = data.message;
      } else {
        this.question = data.question;
        this.loading = false;
      }
    });
  }
}
