import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SignupPage } from './signup/signup.page';
import { SigninPage } from './signin/signin.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'signup',
    component: SignupPage,
  },
  {
    path: 'signin',
    component: SigninPage,
  },
];

@NgModule({
  declarations: [SignupPage, SigninPage],
  imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
})
export class AuthModule {}
