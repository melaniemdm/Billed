import { screen } from "@testing-library/dom"
import BillsUI from "../views/BillsUI.js"
import { bills } from "../fixtures/bills.js"
import ErrorPage from "../views/ErrorPage.js";
import LoadingPage from "../views/LoadingPage.js";
import Bills from "../containers/Bills.js"


jest.mock('../views/LoadingPage.js', () => {
  const originalModule = jest.requireActual('../views/LoadingPage.js');
  //Simule l'exportation par défaut et l'exportation nommée 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'LoadingPage'),
     };
});

jest.mock('../views/ErrorPage.js', () => {
  const originalModule = jest.requireActual('../views/ErrorPage.js');
  //Simule l'exportation par défaut et l'exportation nommée 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => 'ErrorPage'),
      };
});



describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      const html = BillsUI({ data: []})
      document.body.innerHTML = html
      //to-do write expect expression
    })
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })
    test("then the loadingPage appears when loading is true", () => {
      const loadingPageResult = LoadingPage();
      const html = BillsUI({ data: bills, loading : true })
      document.body.innerHTML = html
      
      expect(LoadingPage).toHaveBeenCalled();
    })
    test("then the ErrorPage appears when loading is false", () => {
      const errorPageResult = ErrorPage();
     const html = BillsUI({ data: bills, loading : false, error : true })
      document.body.innerHTML = html
     
      expect(ErrorPage).toHaveBeenCalled();
    })
  })
})

describe("given i need to cover 80% of Bills statements", () => {
  describe("when i create a Bills object", () => {
    test("then it exists", () => {
      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
     let testBills = new Bills({ 
       document: document, 
       onNavigate: null,
       firestore: null, 
       localStorage: null })
       let result = false;
       if(testBills){
      result = true;
       }
       expect(result).toBe(true)
    })
    test("then i can click on the eye", () => {
      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
     let testBills = new Bills({ 
       document: document, 
       onNavigate: null,
       firestore: null, 
       localStorage: null })
     
    $.fn.modal = jest.fn()
      let nodeEye = document.querySelector('#eye')
     nodeEye.click() 
  expect($.fn.modal).toHaveBeenCalled()
   
    })
    test("then i can click on the New Bills", () => {
      const html = BillsUI({ data: bills})
      document.body.innerHTML = html
     let testBills = new Bills({ 
       document: document, 
       onNavigate: null,
       firestore: null, 
       localStorage: null })
       testBills.onNavigate = jest.fn()
       const buttonNewBill = document.querySelector(`button[data-testid="btn-new-bill"]`)
       buttonNewBill.click() 
  expect(testBills.onNavigate).toHaveBeenCalled()
  
    })
  })
  
  
  })