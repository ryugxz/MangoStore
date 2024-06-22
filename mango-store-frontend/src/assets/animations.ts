import { trigger, transition, style, animate } from '@angular/animations';

export const fadeInOutAnimation = trigger('fadeInOut', [
  transition(':enter', [
    // :enter คือจากสถานะ void เป็นอยู่
    style({ opacity: 0 }), // กำหนดให้โปร่งใสเริ่มต้นที่ 0
    animate('300ms', style({ opacity: 1 })), // 300 มิลลิวินาทีเปลี่ยนจากโปร่งใสเป็น 1
  ]),
  transition(':leave', [
    // :leave คือจากสถานะอยู่ไปสู่ void
    animate('300ms', style({ opacity: 0 })), // 300 มิลลิวินาทีเปลี่ยนจากโปร่งใส 1 ไปเป็น 0
  ]),
]);

export const slideInOutAnimation = trigger('slideInOut', [
  transition(':enter', [
    style({ transform: 'translateX(-100%)' }),
    animate('300ms ease-in', style({ transform: 'translateX(0)' })),
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ transform: 'translateX(-100%)' })),
  ]),
]);

export const scaleAnimation = trigger('scale', [
  transition(':enter', [
    style({ transform: 'scale(0.5)', opacity: 0 }),
    animate('300ms', style({ transform: 'scale(1)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms', style({ transform: 'scale(0.5)', opacity: 0 })),
  ]),
]);

export const rotateAnimation = trigger('rotate', [
  transition(':enter', [
    style({ transform: 'rotate(-180deg)', opacity: 0 }),
    animate(
      '500ms cubic-bezier(0.680, -0.550, 0.265, 1.550)',
      style({ transform: 'rotate(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '500ms cubic-bezier(0.680, -0.550, 0.265, 1.550)',
      style({ transform: 'rotate(180deg)', opacity: 0 }),
    ),
  ]),
]);

export const bounceAnimation = trigger('bounce', [
  transition(':enter', [
    style({ transform: 'translateY(-50%)', opacity: 0 }),
    animate(
      '500ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      style({ transform: 'translateY(0)', opacity: 1 }),
    ),
  ]),
  transition(':leave', [
    animate(
      '500ms cubic-bezier(0.215, 0.610, 0.355, 1.000)',
      style({ transform: 'translateY(-50%)', opacity: 0 }),
    ),
  ]),
]);
