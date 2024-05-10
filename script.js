const form = document.getElementById("form");
const phone = document.getElementById("phone");
const message = document.getElementById("message");
const file = document.getElementById("file");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!validate()) return;
  const res = await submitForm();
  if (res === true) alert("Message sent successfully");
  else alert(res);
});

async function submitForm() {
  const formData = new FormData();
  formData.append("phone", "91" + phone.value);
  formData.append("message", message.value);
  formData.append("file", file.files[0]);
  const response = await axios("http://localhost:3300/chat", {
    method: "post",
    data: formData,
  });
  if (response.data.success) return true;
  else return response.data.message;
}

function validate() {
  if (phone.value.trim() === "") {
    alert("Phone is required");
    return false;
  }
  if (phone.value.trim().length < 10) {
    alert("Phone number must be 10 digits");
    return false;
  }
  if (file && file.files.length === 0 && message.value.trim() === "") {
    alert("Message is required");
    return false;
  }
  return true;
}
