import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions } from "@angular/http";
import "rxjs/add/operator/map";
import { tokenNotExpired } from "angular2-jwt";

@Injectable()
export class AuthService {
  domain = "http://localhost:8080/";
  authToken;
  user;
  options;

  constructor(private http: Http) {}

  // funkcija stvara hedere i dodaje token koji se koriste kod HTTP zahtjeva
  createAuthenticationHeaders() {
    this.loadToken();
    this.options = new RequestOptions({
      headers: new Headers({
        "Content-Type": "application/json", // Format set to JSON
        authorization: this.authToken // Attach token
      })
    });
  }

  loadToken() {
    this.authToken = localStorage.getItem("token"); // uzima token s klijenta
  }

  // registracija korisnika
  registerUser(user) {
    return this.http
      .post(this.domain + "authentication/register", user)
      .map(res => res.json());
  }

  // provjera da li je korisnicko ime zauzeto
  checkUsername(username) {
    return this.http
      .get(this.domain + "authentication/checkUsername/" + username)
      .map(res => res.json());
  }

  // provjera da li je email zauzet
  checkEmail(email) {
    return this.http
      .get(this.domain + "authentication/checkEmail/" + email)
      .map(res => res.json());
  }

  // login korisnika
  login(user) {
    return this.http
      .post(this.domain + "authentication/login", user)
      .map(res => res.json());
  }

  // logout korisnika
  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    localStorage.clear(); // Clear local storage
  }

  // zapisivanje korisnickih podataka u memoriju klijenta
  storeUserData(token, user) {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }

  // get za korisnikove podatke
  getProfile() {
    this.createAuthenticationHeaders();
    return this.http
      .get(this.domain + "authentication/profile", this.options)
      .map(res => res.json());
  }

  getPublicProfile(username) {
    this.createAuthenticationHeaders();
    return this.http
      .get(
        this.domain + "authentication/publicProfile/" + username,
        this.options
      )
      .map(res => res.json());
  }

  // provjera da li je korisnik ulogiran
  loggedIn() {
    return tokenNotExpired();
  }
}
