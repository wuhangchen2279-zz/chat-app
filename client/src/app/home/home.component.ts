import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import * as io from "socket.io-client";
import { appConfig } from '../app.config';

@Component({
    moduleId: module.id,
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    socket = io.connect(appConfig.apiUrl);

    constructor(
        private userService: UserService,
        private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    selectedUser(username: string) {
        this.socket.emit('join', { username: username })
    }

    deleteUser(_id: string) {
        this.userService.delete(_id).subscribe(() => { this.loadAllUsers() });
    }

    logout(routeValue) {
        this.socket.disconnect();
        this.router.navigate([routeValue]);
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }
}