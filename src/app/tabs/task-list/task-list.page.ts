import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth/auth.service';
import { FirestoreService } from 'src/app/shared/services/firestore/firestore.service';
import { ITaskWithId } from 'src/app/shared/services/firestore/types';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit {
  tasks$: Observable<ITaskWithId[]>;
  constructor(
    private alert: AlertController,
    private actionSheet: ActionSheetController,
    private firestore: FirestoreService,
    private auth: AuthService,
    private toast: ToastController,
  ) {}

  ngOnInit() {
    this.tasks$ = this.firestore.fetchAllTask();
  }

  async openAlertToCreateTask() {
    const alert = await this.alert.create({
      header: '日課の作成',
      inputs: [
        {
          name: 'name',
          placeholder: '日課の名称',
        },
      ],
      buttons: [
        {
          text: '閉じる',
        },
        {
          text: '作成',
          handler: (data: { name: string }) => {
            this.firestore
              .addTask({
                uid: this.auth.getUserId(),
                name: data.name,
                timestamp: Date.now(),
                isDone: false,
                isTemporary: false,
              })
              .then(() => this.popToast(`${data.name}を追加しました。`));
          },
        },
      ],
    });
    alert.present();
  }

  async openActionSheetOfTask(task: ITaskWithId) {
    const actionSheet = await this.actionSheet.create({
      header: task.name,
      buttons: [
        {
          text: '閉じる',
          role: 'cancel',
          icon: 'close',
        },
      ],
    });

    if (!task.isTemporary) {
      actionSheet.buttons = [
        {
          text: '名称変更',
          handler: async () => {
            const alert = await this.alert.create({
              header: '名称の変更',
              inputs: [
                {
                  name: 'name',
                  placeholder: '日課の名称',
                  value: task.name,
                },
              ],
              buttons: [
                {
                  text: '閉じる',
                },
                {
                  text: '変更',
                  handler: (data: { name: string }) => {
                    this.firestore.updateTask(task.id, data);
                    this.popToast(`${task.name}の名称を${data.name}に変更しました。`);
                  },
                },
              ],
            });
            alert.present();
          },
          icon: 'pencil',
        },
        {
          text: '削除',
          handler: () => {
            this.firestore.deleteTask(task.id);
            this.popToast(`${task.name}を削除しました。`);
          },
          role: 'destructive',
          icon: 'trash',
        },
        ...actionSheet.buttons,
      ];
    }

    if (task.isDone) {
      actionSheet.buttons = [
        {
          text: '未完了に戻す',
          icon: 'arrow-undo-outline',
          handler: () => this.firestore.updateTask(task.id, { isDone: false }),
        },
        ...actionSheet.buttons,
      ];
    }
    actionSheet.present();
  }

  trackByFn(index, item: ITaskWithId) {
    return item.id;
  }

  private popToast(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'bottom') {
    this.toast
      .create({
        message,
        duration,
        position,
      })
      .then((toast) => toast.present());
  }
}
