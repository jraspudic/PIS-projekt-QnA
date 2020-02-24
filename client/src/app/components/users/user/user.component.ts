import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/services/auth.service";

@Component({
  selector: "app-user",
  templateUrl: "./user.component.html",
  styleUrls: ["./user.component.css"]
})
export class UserComponent implements OnInit {
  constructor(private authService: AuthService) {}
  username: string;
  isAdmin: boolean;
  users;

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      if (profile.user) {
        this.username = profile.user.username;
        this.isAdmin = profile.user.isAdmin;
      } else {
        this.username = null;
        this.isAdmin = false;
      }
    });

    this.getAllUsers();
  }

  getAllUsers() {
    this.authService.getUsers().subscribe(data => {
      this.users = data.users;
    });
  }

  deleteUser(id) {
    console.log(id);
    this.authService.deleteUser(id).subscribe(data => {
      console.log(data);
      this.getAllUsers();
    });
  }
}
