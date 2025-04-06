import { Apollo } from "apollo-angular";
import { throwError, type Observable } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { gql } from "apollo-angular";
import type { Employee } from "../models/employee.model";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  getEmployees(): Observable<Employee[]> {
    return this.apollo
      .query<{ getEmployees: Employee[] }>({
        query: gql`
        query GetEmployees {
          getEmployees {
            id
            firstName
            lastName
            email
            gender
            salary
            position
            department
            profilePicture
          }
        }
      `,
      })
      .pipe(
        map((result) => result.data.getEmployees),
        catchError((error) => throwError(() => error)),
      );
  }

  getEmployee(id: string): Observable<Employee> {
    return this.apollo
      .query<{ getEmployee: Employee }>({
        query: gql`
        query GetEmployee($id: ID!) {
          getEmployee(id: $id) {
            id
            firstName
            lastName
            email
            gender
            salary
            position
            department
            profilePicture
          }
        }
      `,
        variables: { id },
      })
      .pipe(
        map((result) => result.data.getEmployee),
        catchError((error) => throwError(() => error)),
      );
  }

  searchEmployees(department?: string, position?: string): Observable<Employee[]> {
    const variables: any = {};

    if (department) {
      variables.department = department;
    }

    if (position) {
      variables.position = position;
    }

    return this.apollo
      .query<{ searchEmployees: Employee[] }>({
        query: gql`
        query SearchEmployees($department: String, $position: String) {
          searchEmployees(department: $department, position: $position) {
            id
            firstName
            lastName
            email
            gender
            salary
            position
            department
            profilePicture
          }
        }
      `,
        variables: variables,
      })
      .pipe(
        map((result) => result.data.searchEmployees),
        catchError((error) => throwError(() => error)),
      );
  }

  addEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<{ addEmployee: Employee }>({
        mutation: gql`
        mutation AddEmployee(
          $firstName: String!
          $lastName: String!
          $email: String!
          $gender: String
          $salary: Float
          $position: String
          $department: String
          $profilePicture: String
        ) {
          addEmployee(
            firstName: $firstName
            lastName: $lastName
            email: $email
            gender: $gender
            salary: $salary
            position: $position
            department: $department
            profilePicture: $profilePicture
          ) {
            id
            firstName
            lastName
            email
            gender
            salary
            position
            department
            profilePicture
          }
        }
      `,
        variables: employee,
      })
      .pipe(
        map((result) => result.data!.addEmployee),
        catchError((error) => throwError(() => error)),
      );
  }

  updateEmployee(employee: Partial<Employee>): Observable<Employee> {
    return this.apollo
      .mutate<{ updateEmployee: Employee }>({
        mutation: gql`
        mutation UpdateEmployee(
          $id: ID!
          $firstName: String
          $lastName: String
          $email: String
          $gender: String
          $salary: Float
          $position: String
          $department: String
          $profilePicture: String
        ) {
          updateEmployee(
            id: $id
            firstName: $firstName
            lastName: $lastName
            email: $email
            gender: $gender
            salary: $salary
            position: $position
            department: $department
            profilePicture: $profilePicture
          ) {
            id
            firstName
            lastName
            email
            gender
            salary
            position
            department
            profilePicture
          }
        }
      `,
        variables: employee,
      })
      .pipe(
        map((result) => result.data!.updateEmployee),
        catchError((error) => throwError(() => error)),
      );
  }

  deleteEmployee(id: string): Observable<Employee> {
    return this.apollo
      .mutate<{ deleteEmployee: Employee }>({
        mutation: gql`
        mutation DeleteEmployee($id: ID!) {
          deleteEmployee(id: $id) {
            id
          }
        }
      `,
        variables: { id },
      })
      .pipe(
        map((result) => result.data!.deleteEmployee),
        catchError((error) => throwError(() => error)),
      );
  }
}
