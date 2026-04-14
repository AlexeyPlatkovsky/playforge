import { xComponent } from "../framework/core/xComponent";

export class LoginFormComponent extends xComponent {
  readonly password = this.$("input[name='password']");
  readonly submit = this.$("button[type='submit']");
  readonly username = this.$("input[name='username']");

  async loginAs(username: string, password: string): Promise<void> {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.submit.click();
  }
}
