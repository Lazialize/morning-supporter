import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ConditionType } from '../../services/task/Interfaces/condition';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.page.html',
  styleUrls: ['./create-task.page.scss'],
})
export class CreateTaskPage implements OnInit {
  name: string;
  isConditional: boolean;
  selected: string;
  selectedDayOfWeekType: string;
  selectedWeather: string[];
  selectedTense: string[];
  selectedOrdinal: string;
  selectedDayOfWeek: string;
  selectedDayOfWeeks: string[];

  readonly weatherConditions = {
    2: '雷雨',
    3: '霧雨',
    5: '雨',
    6: '雪',
    7: '視界不良',
  };

  readonly dayOfWeeks = {
    0: '日曜日',
    1: '月曜日',
    2: '火曜日',
    3: '水曜日',
    4: '木曜日',
    5: '金曜日',
    6: '土曜日',
  };

  constructor(private modal: ModalController, private task: TaskService) {
    this.name = null;
    this.isConditional = false;
    this.selected = null;
    this.selectedDayOfWeekType = null;
    this.selectedWeather = [];
    this.selectedTense = [];
    this.selectedOrdinal = null;
    this.selectedDayOfWeek = null;
    this.selectedDayOfWeeks = [];
  }

  ngOnInit() {}

  dismissModal() {
    this.modal.dismiss();
  }

  selectedItemChanged() {
    console.log(this.selected);
    console.log(this.selectedWeather);
  }

  getConditionKeys(obj: object) {
    return Object.keys(obj);
  }

  submit() {
    if (!this.isConditional) {
      this.task.addTask({ name: this.name });
    } else if (this.selected === 'weather') {
      this.task.addTask(
        {
          name: this.name,
          temporaryCondition: {
            conditionType: ConditionType.weather,
            conditions: {
              tense: this.selectedTense.map((v) => Number(v)),
              weatherId: this.selectedWeather.map((v) => Number(v)),
            },
          },
        },
        true,
      );
    } else if (this.selectedDayOfWeekType === 'ordinal') {
      this.task.addTask(
        {
          name: this.name,
          temporaryCondition: {
            conditionType: ConditionType.dayOfWeek,
            conditions: {
              isOrdinal: true,
              dayOfWeeks: {
                ordinal: Number(this.selectedOrdinal),
                dayOfWeek: Number(this.selectedDayOfWeek),
              },
            },
          },
        },
        true,
      );
    } else {
      this.task.addTask(
        {
          name: this.name,
          temporaryCondition: {
            conditionType: ConditionType.dayOfWeek,
            conditions: {
              isOrdinal: false,
              dayOfWeeks: this.selectedDayOfWeeks.map((v) => Number(v)),
            },
          },
        },
        true,
      );
    }

    this.modal.dismiss();
  }

  canSubmit() {
    if (!this.isConditional) {
      return this.name !== null && this.name.length > 0;
    }

    if (this.name !== null && this.name.length > 0) {
      if (this.selected === 'weather') {
        if (
          this.selectedWeather === null ||
          this.selectedWeather.length < 1 ||
          this.selectedTense === null ||
          this.selectedTense.length < 1
        ) {
          return false;
        }
        return true;
      } else if (this.selected === 'dayOfWeek') {
        if (this.selectedDayOfWeekType === 'ordinal') {
          return this.selectedOrdinal !== null && this.selectedDayOfWeek !== null;
        } else if (this.selectedDayOfWeekType === 'multiple') {
          return this.selectedDayOfWeeks !== null && this.selectedDayOfWeeks.length > 0;
        }
        return false;
      }
    }

    return false;
  }
}
