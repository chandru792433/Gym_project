import { Component, OnInit, ViewChild } from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import { User } from '../models/user.model';
import { ApiService } from '../services/api.service';
import { Route, Router } from '@angular/router';
import{NgConfirmService} from 'ng-confirm-box'
import { NgToastService } from 'ng-angular-popup';
@Component({
  selector: 'app-registration-list',
  templateUrl: './registration-list.component.html',
  styleUrls: ['./registration-list.component.scss']
})
export class RegistrationListComponent implements OnInit {
public dataSource!: MatTableDataSource<User>;
public user!: User[];
@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild(MatSort) sort!: MatSort
displayedColumns:string[] = ['id','firstName','lastName','email','mobile','bmResult','gender','package','enquiryData','acrion'];

constructor(private api: ApiService, private router: Router,private confirm:NgConfirmService, private toast:NgToastService){

}
  ngOnInit(): void {
  this.getUsers();
  }

 getUsers(){
  this.api.getRegistredUser()
     .subscribe(res=>{
      this.user = res;
      this.dataSource = new MatTableDataSource(this.user);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
     })
 }

 applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();

  if (this.dataSource.paginator) {
    this.dataSource.paginator.firstPage();
  }
}

edit(id:number){
this.router.navigate(['update',id])
}

delete(id:number){
  this.confirm.showConfirm("Are you sure want to delete",
  ()=>{
    this.api.deleteRegistered(id)
    .subscribe(res=>{
      this.getUsers();
    })
  },
  ()=>{

  }
  )
 
}
}
