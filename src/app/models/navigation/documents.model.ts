import {User} from '../user.model';
import {MatTableDataSource} from '@angular/material';

export interface Documents {
  dataSource: MatTableDataSource<any>;
  file: File;
  uploadedBy: User;
}
