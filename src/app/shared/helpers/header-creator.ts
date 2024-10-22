import { HttpHeaders } from "@angular/common/http";

export class HeaderCreator {
    static CreateHeader(): any {
        const httpOptions = {
            headers: new HttpHeaders({'Content-Type': 'application/json'})
        }

        return httpOptions;
    }
}