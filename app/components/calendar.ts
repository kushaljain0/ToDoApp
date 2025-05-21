export interface CalendarOptions {
    containerId: string;
    onDateSelect?: (date: Date) => void;
    initialDate?: Date;
}

export class Calendar {
    private container: HTMLElement;
    private currentDate: Date;
    private selectedDate: Date | null;
    private onDateSelect: ((date: Date) => void) | undefined;

    constructor(options: CalendarOptions) {
        const container = document.getElementById(options.containerId);
        if (!container) {
            throw new Error(`Calendar container with id "${options.containerId}" not found`);
        }
        this.container = container;
        this.currentDate = options.initialDate || new Date();
        this.selectedDate = options.initialDate || null;
        this.onDateSelect = options.onDateSelect;
        this.render();
    }

    private render(): void {
        this.container.innerHTML = '';
        this.container.className = 'calendar';

        // Create calendar header
        const header = document.createElement('div');
        header.className = 'calendar-header';

        const prevButton = document.createElement('button');
        prevButton.textContent = '←';
        prevButton.onclick = () => this.previousMonth();

        const nextButton = document.createElement('button');
        nextButton.textContent = '→';
        nextButton.onclick = () => this.nextMonth();

        const monthYear = document.createElement('span');
        monthYear.textContent = this.getMonthYearString();

        header.appendChild(prevButton);
        header.appendChild(monthYear);
        header.appendChild(nextButton);
        this.container.appendChild(header);

        // Create weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekdayHeader = document.createElement('div');
        weekdayHeader.className = 'calendar-weekdays';
        weekdays.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.textContent = day;
            weekdayHeader.appendChild(dayElement);
        });
        this.container.appendChild(weekdayHeader);

        // Create calendar grid
        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        const firstDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        const lastDay = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0);
        const startingDay = firstDay.getDay();
        const totalDays = lastDay.getDate();

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'calendar-day empty';
            grid.appendChild(emptyCell);
        }

        // Add cells for each day of the month
        for (let day = 1; day <= totalDays; day++) {
            const dayCell = document.createElement('div');
            dayCell.className = 'calendar-day';
            dayCell.textContent = day.toString();

            const currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
            
            if (this.selectedDate && this.isSameDay(currentDate, this.selectedDate)) {
                dayCell.classList.add('selected');
            }

            if (this.isToday(currentDate)) {
                dayCell.classList.add('today');
            }

            dayCell.onclick = () => this.selectDate(currentDate);
            grid.appendChild(dayCell);
        }

        this.container.appendChild(grid);
    }

    private getMonthYearString(): string {
        const months = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        return `${months[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
    }

    private previousMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.render();
    }

    private nextMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.render();
    }

    private selectDate(date: Date): void {
        this.selectedDate = date;
        this.render();
        if (this.onDateSelect) {
            this.onDateSelect(date);
        }
    }

    private isSameDay(date1: Date, date2: Date): boolean {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    }

    private isToday(date: Date): boolean {
        const today = new Date();
        return this.isSameDay(date, today);
    }

    public getSelectedDate(): Date | null {
        return this.selectedDate;
    }

    public setDate(date: Date): void {
        this.currentDate = new Date(date);
        this.selectedDate = new Date(date);
        this.render();
    }
} 