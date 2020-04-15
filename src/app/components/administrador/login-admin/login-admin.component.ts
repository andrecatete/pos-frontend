import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/service/login/login.service';
import { AlertModalService } from 'src/app/shared/alert-modal.service';

@Component({
  selector: 'app-login-admin',
  templateUrl: './login-admin.component.html',
  styleUrls: ['./login-admin.component.css']
})
export class LoginAdminComponent implements OnInit {

  //login = {} as Login;
  retornoErro = new String();
  loginForm = ({
    username: '',
    password: '',
  });
  status: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private alertService: AlertModalService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(
      (queryParams: any) => {
        this.status = queryParams['status'];
      }
    );

    if(this.status == "sucesso"){
      this.alertService.showAlertSucces("Email confirmado! ");
    }else if(this.status == "erro"){
      this.alertService.showAlertDanger("Email não pôde ser validado!")
    }
  }

  Acessar(form: NgForm) {
    
    //Validar Usuario e senha
       //Validar Usuario e senha
       this.loginService.Logar(this.loginForm.username, this.loginForm.password).subscribe( data =>  {

          console.log(data.token)
          this.loginService.token = data.token;
          this.loginService.IsAuthenticate = true;
          this.loginService.username = this.loginForm.username;
          this.router.navigate(["home"]);
        }, err => { 
          this.retornoErro = err;
          this.loginService.IsAuthenticate = false;
         }    
       );
    
  }

  ValidaCampos(form: NgForm): boolean {
    if (!form.valid) {
      this.retornoErro = "Informe Usuario e Senha";
      return false;
    } 
    return true;
  }
}
