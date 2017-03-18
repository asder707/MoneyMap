import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Wallet,IWallet} from '../../database';

/*
  Generated class for the Wallets page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-wallets',
  templateUrl: 'wallets.html'
})
export class WalletsPage {

  wallets : IWallet[];
  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidEnter() {
    Wallet.all().then(results => this.wallets = results);
  }

}