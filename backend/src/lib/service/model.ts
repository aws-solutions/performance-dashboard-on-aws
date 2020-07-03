import Department from '../department/model';

export interface Service {
    id: string,
    name: string,
    department?: Department,
}

export default Service;