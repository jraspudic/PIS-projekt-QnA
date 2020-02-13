import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { RegisterComponent } from "./components/register/register.component";
import { AuthService } from "./services/auth.service";
import { QnaService } from "./services/qna.service";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { FlashMessagesModule } from "angular2-flash-messages";
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";
import { QnaComponent } from "./components/qna/qna.component";
import { EditQuestionComponent } from "./components/qna/edit-qna/edit-qna.component";
import { DeleteQuestionComponent } from "./components/qna/delete-qna/delete-qna.component";
import { PublicProfileComponent } from "./components/public-profile/public-profile.component";
import { FilterPipe } from "./filter.pipe";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    QnaComponent,
    EditQuestionComponent,
    DeleteQuestionComponent,
    PublicProfileComponent,
    FilterPipe
  ],
  imports: [
    BrowserModule,
    HttpModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, QnaService],
  bootstrap: [AppComponent]
})
export class AppModule {}
