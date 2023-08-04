import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ApiService } from '../services/api.service';
import { NgToastService } from 'ng-angular-popup';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../models/user.model';

@Component({
  selector: 'app-create-registration',
  templateUrl: './create-registration.component.html',
  styleUrls: ['./create-registration.component.scss']
})
export class CreateRegistrationComponent implements OnInit{
  public packages =["Monthly",'Quaterly','Yearly'];
  public genders = ["Male","Female"]
  public userIdToUpdate!:number;
 public importantList: string[] =[
  "Toxic Fat reducton",
  "Energy and Endurance",
  "Building Lean Muscle",
  "Healthier Digestive System",
  "sugar Creaving body",
  "Fitness"
 ];

 public registerForm!: FormGroup;
 public isUpdateActivate: boolean = false

 constructor(private fb: FormBuilder, private api:ApiService, private router:Router, private tostService:NgToastService, private activatedRout:ActivatedRoute){

 }
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      firstName:[''],
      lastName:[''],
      email:[''],
      mobile:[''],
      height:[''],
      weight:[''],
      bmiResult:[''],
      bmi:[''],
      gender:[''],
      requireTrainer:[''],
      package:[''],
      important:[''],
      haveGymBefore:[''],
      enquiryDate:['']
    });
    this.registerForm.controls['height'].valueChanges.subscribe(res=>{
      this.calculateBmi(res);
      
    })

    this.activatedRout.params.subscribe(val=>{
      this.userIdToUpdate = val['id'];
      this.api.getRegisteredUserId(this.userIdToUpdate)
      .subscribe(res=>{
        this.isUpdateActivate = true;
        this.fillFormToUpdate(res)
      })
    })
  }
  Submit(){
    this.api.postRegistration(this.registerForm.value)
    .subscribe(res=>{
      this.tostService.success({detail:"Success",summary:"Enquiry added",duration:3000});
      this.registerForm.reset();
    })
  }
  Update(){
    this.api.UpdateRegisteredUser(this.registerForm.value,this.userIdToUpdate)
    .subscribe(res=>{
      this.tostService.success({detail:"Success",summary:"Enquiry Updated",duration:3000});
      this.registerForm.reset();
      this.router.navigate(['list']);
    })
  }

  calculateBmi(heightvalue:number){
    const weight= this.registerForm.value.height;
    const height = heightvalue;
    const bmi = weight/(height*height);
    this.registerForm.controls['bmi'].patchValue(bmi);
    switch(true){
      case bmi < 18.5:
        this.registerForm.controls['bmiResult'].patchValue("underweight");
        break;
        case (bmi >= 18.5 && bmi <25):
        this.registerForm.controls['bmiResult'].patchValue("Normalweight");
        break;
        case(bmi >=25 && bmi < 30):
        this.registerForm.controls['bmiResult'].patchValue("OverWeight");
        break;

        default:
          this.registerForm.controls['bmiResult'].patchValue("Obse");

          break;
    }
  }

 fillFormToUpdate(user: User){
  this.registerForm.setValue({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    mobile:user.mobile,
    weight: user.weight,
    height: user.height,
    bmi: user.bmi,
    bmiResult:user.bmiResult,
    gender: user.gender,
    requireTrainer: user.requireTrainer,
    package: user.package,
    important: user.important,
    haveGymBefore: user.haveGymBefore,
    enquiryDate: user.enquiryDate
  })
 }
}
