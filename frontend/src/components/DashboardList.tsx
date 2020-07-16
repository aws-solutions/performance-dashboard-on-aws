import React from 'react';
import { Link } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import lo from 'lodash';
import './DashboardList.css';

type Department = {
    id: string,
    name: string,
};

type Service = {
    id: string,
    name: string,
    department: Department,
};

type Dashboard = {
    id: string,
    name: string,
    service: Service,
};

type Props = {
    dashboards: Array<Dashboard>,
}

function DashboardList(props: Props) {

    const deptNames = new Map();
    const dashboardsByDept = lo.groupBy(props.dashboards, 'service.department.id');
    props.dashboards.forEach(dash => {
        const { department } = dash.service;
        deptNames.set(department.id, department.name);
    });

    const departments = Object.keys(dashboardsByDept);
    const list = departments.map(deptId => {
        const dashboards = dashboardsByDept[deptId];
        const dashList = dashboards.map((dash: Dashboard) => (
            <div key={dash.id} className="DashboardName">
                <Link to={`/dashboard/${dash.id}`}>{dash.name}</Link>
            </div>
        ));

        return (
            <Row key={deptId} className="DepartmentRow">
                <Col>
                    <span className="DepartmentName">
                        {deptNames.get(deptId)}
                    </span>
                </Col>
                <Col>
                    {dashList}
                </Col>
            </Row>
        );
    });

    return (
        <div>
            {list}
        </div>
    )
}

export default DashboardList;