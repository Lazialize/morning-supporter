import { Component, OnInit } from '@angular/core';
import { AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { ITaskWithId } from 'src/app/shared/services/task/Interfaces/task';
import { TaskService } from 'src/app/shared/services/task/task.service';

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
    private toast: ToastController,
    private taskSrv: TaskService,
  ) {}

  ngOnInit() {
    this.tasks$ = this.taskSrv.getObserver();
  }

  async editTask(task: ITaskWithId) {
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
            this.taskSrv.updateTask(task.id, data).then(() => {
              this.popToast(`「${task.name}」の名称を「${data.name}」に変更しました。`);
            });
          },
        },
      ],
    });
    alert.present();
  }

  async deleteTask(task: ITaskWithId) {
    this.taskSrv.deleteTask(task.id).then(() => {
      this.popToast(`「${task.name}」を削除しました。`);
    });
  }

  async checkBoxChanged(task: ITaskWithId) {
    this.taskSrv.updateTask(task.id, { isDone: !task.isDone }).then(() => {
      this.popToast(`「${task.name}」を${task.isDone ? '未完了' : '完了'}にしました。`);
    });
  }

  trackByFn(index, item: ITaskWithId) {
    return item.id;
  }

  private popToast(message: string, duration: number = 2000, position: 'top' | 'bottom' | 'middle' = 'top') {
    this.toast
      .create({
        message,
        duration,
        position,
      })
      .then((toast) => toast.present());
  }
}
