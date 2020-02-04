import { RouterModule, Routes } from "@angular/router";
import { NgModule } from "@angular/core";
import { RegisterComponent } from "./components/register/register.component";
import { LoginComponent } from "./components/login/login.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { PublicProfileComponent } from "./components/public-profile/public-profile.component";
import { QnaComponent } from "./components/qna/qna.component";
import { EditQuestionComponent } from "./components/qna/edit-qna/edit-qna.component";
import { DeleteQuestionComponent } from "./components/qna/delete-qna/delete-qna.component";
import { AuthGuard } from "./guards/auth.guard";
import { NotAuthGuard } from "./guards/notAuth.guard";

const appRoutes: Routes = [
  {
    path: "",
    component: QnaComponent
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NotAuthGuard]
  },
  {
    path: "profile",
    component: ProfileComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "edit-question/:id",
    component: EditQuestionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "delete-question/:id",
    component: DeleteQuestionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "user/:username",
    component: PublicProfileComponent,
    canActivate: [AuthGuard]
  },
  { path: "**", component: QnaComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})
export class AppRoutingModule {}
