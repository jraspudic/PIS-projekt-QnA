import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.css"]
})
export class ProfileComponent implements OnInit {
  username = "";
  email = "";
  isAdmin = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.email = profile.user.email;
      this.isAdmin = profile.user.isAdmin;
      console.log(profile.user);
      console.log("|^^");
    });
  }
}
