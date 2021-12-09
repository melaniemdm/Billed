import { fireEvent, screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import firestore from "../app/Firestore.js"
import firebase from "../__mocks__/firebase"
import BillsUI from "../views/BillsUI.js";

describe("Given I am connected as an employee",  () => {
  describe("When I am on NewBill Page", () => {
    //mock des console.log
    window.console.log = jest.fn()
    //mock de la fonction alert du navigateur
    window.alert = jest.fn((x) => { "message de log" })
    //mock du localStorage avec les informations de l'utilisateur
    localStorage.__proto__.getItem=jest.fn((x) => '{"type":"Employee","email":"johndoe@email.com","password":"azerty","status":"connected"}')
    //Test d'import d'un fichier avec une mauvaise extension
    test("Then I can't create a new bill without a correct image file",  () => {
      //création du DOM 
      const html = NewBillUI()
      document.body.innerHTML = html
      
      //création du faux fichier à uploader
      let file = new File(['(⌐□_□)'], 'test-img.webp', { type: 'image/webp' });

      //upload du fichier dans le input
      Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
        value: [file]
      })
            //création de l'objet NewBill après avoir chargé le fichier dans l'input
      let newBill = new NewBill({ document: document, onNavigate: null, firestore: firestore, localStorage:localStorage })
      //Insertion manuelle du fichier dans l'objet newBill
      newBill.fileName = document.querySelector(`input[data-testid="file"]`).files[0].name
      newBill.fileUrl = "./justificatifs/" + newBill.fileName
      //Submit du formulaire
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      fireEvent.submit(formNewBill)
      //Vérification que la fonction a bien été appelée
      expect(localStorage.getItem).toBeCalledWith("user")
      expect(window.alert).toHaveBeenCalled
    })
    
    test("Then I can submit a form",  () => {
      //création du formualaire et ajout dans le DOM
      const html = NewBillUI()
      document.body.innerHTML = html
      //création du faux fichier à uploader
      let file = new File(['(⌐□_□)'], 'test-img.png', { type: 'image/png' });
      //upload du fichier dans le input
      Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
        value: [file]
      })
      //création de l'objet NewBill après avoir chargé le fichier dans l'input
      let newBill = new NewBill({ document: document, onNavigate: null, firestore: firestore, localStorage:localStorage })
       //Insertion manuelle du fichier dans l'objet newBill
      newBill.fileName = document.querySelector(`input[data-testid="file"]`).files[0].name
      newBill.fileUrl = "./justificatifs/" + newBill.fileName
      //mock des fonctions dépendantes du backend (firestore) 
      newBill.createBill = jest.fn()
      newBill.onNavigate = jest.fn()
      //Submit du formulaire
      const formNewBill = document.querySelector(`form[data-testid="form-new-bill"]`)
      fireEvent.submit(formNewBill)
      //Vérification des fonctions appelées lors du submit
      expect(localStorage.getItem).toBeCalledWith("user")
      expect(newBill.createBill).toHaveBeenCalled()
      expect(newBill.onNavigate).toHaveBeenCalled()
      expect(window.alert).not.toHaveBeenCalled
    })
    test("Then uploading a new file change the NewBill file information",  () => {
      //création du formualaire et ajout dans le DOM
      const html = NewBillUI()
      document.body.innerHTML = html
      //creation d'un fichier fictif, de son nom et de son type
      let file = new File(['(⌐□_□)'], 'test-img.png', { type: 'image/png' });
      //Permet de définir une nouvelle propriété ou de modifier une propriété existante
      Object.defineProperty(document.querySelector(`input[data-testid="file"]`), 'files', {
        value: [file],
        configurable: true
      })
     
   //creation d'un nouveau fichier fictif, de son nom et de son type
       let newFile = new File(['(⌐□_□)'], 'test-img.jpg', { type: 'image/jpg' });
//permet de simuler des event sur la page
      fireEvent.change(document.querySelector(`input[data-testid="file"]`), { 
            target: {
              files: [newFile]
            }})
       //creation de l'objet newBill
       let newBill = new NewBill({ document: document, onNavigate: null, firestore: firestore, localStorage:localStorage })
       //attendu la function doit generer une erreur a cause de firestore
      expect(newBill.handleChangeFile).toThrow(TypeError);     

    })
  })
})

//test d'integration
describe('Given I am connected as an employee', () => {
  describe('When I submit a new bill', () => {
    test('Then I send a POST on the mocked API ', async () => {
      const getSpy = jest.spyOn(firebase, "post")
      const newbill = await firebase.post()
      expect(getSpy).toHaveBeenCalledTimes(1)
      expect(newbill.message).toBe("bill posted")
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      firebase.post.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})
