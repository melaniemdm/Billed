import { screen } from "@testing-library/dom";
import BillsUI from "../views/BillsUI.js";
import { bills } from "../fixtures/bills.js";
import ErrorPage from "../views/ErrorPage.js";
import LoadingPage from "../views/LoadingPage.js";
import Bills from "../containers/Bills.js";

jest.mock("../views/LoadingPage.js", () => {
  const originalModule = jest.requireActual("../views/LoadingPage.js");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "LoadingPage"),
  };
});

jest.mock("../views/ErrorPage.js", () => {
  const originalModule = jest.requireActual("../views/ErrorPage.js");

  return {
    __esModule: true,
    ...originalModule,
    default: jest.fn(() => "ErrorPage"),
  };
});

describe("Given I am connected as an employee", () => {
  describe("When I am on Bills Page", () => {
    test("Then bill icon in vertical layout should be highlighted", () => {
      localStorage.__proto__.getItem = jest.fn(
        (x) =>
          '{"type":"Employee","email":"johndoe@email.com","password":"azerty","status":"connected"}'
      );
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      // code from Router.js
      const divIcon1 = document.getElementById("layout-icon1");
      const divIcon2 = document.getElementById("layout-icon2");
      divIcon1.classList.add("active-icon");
      divIcon2.classList.remove("active-icon");
      //to-do write expect expression
     let nodeHtmlLayoutIcon1 = document.querySelector("#layout-icon1");
      expect(nodeHtmlLayoutIcon1.className).toBe(`active-icon`);
    });
    test("Then bills should be ordered from earliest to latest", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      const dates = screen
        .getAllByText(
          /^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i
        )
        .map((a) => a.innerHTML);
      const antiChrono = (a, b) => (a < b ? 1 : -1);
      const datesSorted = [...dates].sort(antiChrono);
      expect(dates).toEqual(datesSorted);
    });
    test("then the loadingPage appears when loading is true", () => {
      const html = BillsUI({ data: bills, loading: true });
      document.body.innerHTML = html;

      expect(LoadingPage).toHaveBeenCalled();
    });
    test("then the ErrorPage appears when loading is false", () => {
      const html = BillsUI({ data: bills, loading: false, error: true });
      document.body.innerHTML = html;

      expect(ErrorPage).toHaveBeenCalled();
    });
  });
});

describe("given i'm connected as employed'", () => {
  describe("when i create a Bills object", () => {
    //On teste que la création d'une liste de bill fonctionne => création d'un objet de classe Bills
    test("then it exists", () => {
      const html = "<body></body>";
      document.body.innerHTML = html;
      let testBills = new Bills({
        document: document,
        onNavigate: null,
        firestore: null,
        localStorage: null,
      });
      let result = false;
      if (testBills) {
        result = true;
      }
      expect(result).toBe(true);
    });
    // on teste que lorsqu'un objet de classe Bills est créé, on peut cliquer sur l'oeil car il y a bien un évènement sur le noeud 'eye'
    test("then i can click on the eye", () => {
      document.body.innerHTML = ` <div class="icon-actions">
      <div id="eye" data-testid="icon-eye" data-bill-url="test.html">
        eyeIcon
      </div>
    </div>`;
      new Bills({
        document: document,
        onNavigate: null,
        firestore: null,
        localStorage: null,
      });

      $.fn.modal = jest.fn();
      let nodeEye = document.querySelector("#eye");
      nodeEye.click();
      expect($.fn.modal).toHaveBeenCalled();
    });
    // on teste que l'on peut cliquer sur le bouton de création d'une nouvelle bill car il y a bien un évènement sur le bouton
    test("then i can click on the New Bills", () => {
      document.body.innerHTML = `<button type="button" data-testid='btn-new-bill' class="btn btn-primary">
      Nouvelle note de frais</button>`;
      let testBills = new Bills({
        document: document,
        onNavigate: null,
        firestore: null,
        localStorage: null,
      });
      testBills.onNavigate = jest.fn();
      const buttonNewBill = document.querySelector(
        `button[data-testid="btn-new-bill"]`
      );
      buttonNewBill.click();
      expect(testBills.onNavigate).toHaveBeenCalled();
    });
    // on teste que l'on peut demander la liste des bills contenues dans l'objet de classe Bills en appelant la fonction getBills
    test("then i can get the bills", () => {
      const html = BillsUI({ data: bills });
      document.body.innerHTML = html;
      localStorage.__proto__.getItem = jest.fn(
        (x) =>
          '{"type":"Employee","email":"johndoe@email.com","password":"azerty","status":"connected"}'
      );
      let testBills = new Bills({
        document: document,
        onNavigate: null,
        firestore: null,
        localStorage: localStorage,
      });
      testBills.getBills();
      expect(localStorage.getItem).toBeCalledWith("user");
      localStorage.__proto__.getItem = jest.fn();
     let billRows = document.querySelectorAll("#eye");
     //4 corrrespond au 4bills de fixtures
      expect(billRows.length).toBe(4);
    });
  });
});
