import Block from "../../../core/block";

interface ModalProps {
  isOpen: boolean;
  title: string;
  content: Block;
  onClose: () => void;
  onSubmit?: () => void;
  submitButtonText?: string;
  SubmitButton?: Block;
  CloseButton?: Block;
}

export default class Modal extends Block {
  constructor(props: ModalProps) {
    super("div", {
      ...props,
      className: "modal",
      children: {
        content: props.content,
        SubmitButton: props.SubmitButton,
        CloseButton: props.CloseButton,
      },
      events: {
        click: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.classList.contains("modal")) {
            console.log('Modal background clicked');
            props.onClose();
          }
        },
        submit: (e: Event) => {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (target.closest('[data-action="submit"]')) {
            if (props.onSubmit) {
              props.onSubmit();
            }
          }
        },
        close: (e: Event) => {
          const target = e.target as HTMLElement;
          if (target.closest('[data-action="close"]')) {
            props.onClose();
          }
        }
      },
    });
  }

  public render(): string {
    console.log('Modal render, isOpen:', this.props.isOpen);
    return `
      {{#if isOpen}}
        <div class="modal">
          <div class="modal__content">
            <h2 class="modal__title">{{title}}</h2>
              {{{content}}}
           <div class="modal__buttons">
            {{{SubmitButton}}}
            {{{CloseButton}}}
</div>
          </div>
        </div>
      {{/if}}
    `;
  }
}
