import * as React from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import updateLocale from "dayjs/plugin/updateLocale";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar, PickersDay } from "@mui/x-date-pickers";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  MenuItem,
  Select,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/AuthContext"; // ✅ Importa o contexto

import "../escolher-data/escolher-data.css";
import {
  listarAgenda,
  adicionarDisponibilidade,
} from "../../services/chamadasAPIAgenda";

dayjs.extend(updateLocale);
dayjs.updateLocale("pt-br", { weekStart: 1 });
dayjs.locale("pt-br");

export default function EscolhaDataCard({ onClose }) {
  const { usuario } = useAuth(); // ✅ Pega o usuário logado
  const [value, setValue] = React.useState(null);
  const [hora, setHora] = React.useState("");
  const [datasExistentes, setDatasExistentes] = React.useState([]);
  const [horariosDisponiveis, setHorariosDisponiveis] = React.useState([]);

  React.useEffect(() => {
    async function fetchDatas() {
      try {
        const datas = await listarAgenda();
        setDatasExistentes(datas.map((d) => d.dataDisponivel));
        console.log("Datas existentes:", datas.map((d) => d.dataDisponivel));
      } catch (err) {
        alert("Erro ao buscar datas já cadastradas.");
        console.error(err);
      }
    }
    fetchDatas();
  }, []);

  React.useEffect(() => {
    const horarios = [];
    let horaAtual = dayjs().hour(9).minute(0).second(0);
    const horaFinal = dayjs().hour(17).minute(0).second(0);

    while (horaAtual.isBefore(horaFinal)) {
      horarios.push(horaAtual.format("HH:mm"));
      horaAtual = horaAtual.add(30, "minute");
    }
    setHorariosDisponiveis(horarios);
  }, []);

  const handleClose = () => onClose();

  const handleSave = async () => {
    if (!value || !hora) {
      alert("Selecione uma data e um horário!");
      return;
    }

    if (!usuario || !usuario.id) {
      alert("Usuário não logado. Faça login novamente.");
      return;
    }

    try {
      const dataHoraISO = dayjs(value)
        .hour(parseInt(hora.split(":")[0]))
        .minute(parseInt(hora.split(":")[1]))
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss");

      await adicionarDisponibilidade({
        fkGuia: usuario.id, // ✅ passa o ID do usuário logado
        dataDisponivel: dataHoraISO,
      });

      alert("Disponibilidade adicionada!");
      handleClose();
    } catch (err) {
      console.error(err);
      alert(
        "Erro ao adicionar disponibilidade: " +
          (err.response?.data || err.message)
      );
    }
  };

  function CustomPickersDay(props) {
    const { day, datasExistentes, selected, ...other } = props;
    const diaAtual = dayjs(day).format("YYYY-MM-DD");
    const existe = datasExistentes.some(
      (d) => dayjs(d).format("YYYY-MM-DD") === diaAtual
    );

    return (
      <PickersDay
        {...other}
        day={day}
        selected={selected}
        disabled={existe}
        sx={{
          borderRadius: "50%",
          backgroundColor: existe
            ? "#e0e0e0"
            : selected
            ? "#27ae60"
            : undefined,
          color: existe ? "#999" : selected ? "#fff" : undefined,
          "&:hover": {
            backgroundColor: existe
              ? "#ccc"
              : selected
              ? "#219150"
              : "#f0f0f0",
          },
          "&.Mui-selected": {
            backgroundColor: "#27ae60 !important",
            color: "#fff",
          },
          "&.Mui-selected:hover": {
            backgroundColor: "#219150 !important",
          },
        }}
      />
    );
  }

  return (
    <div
      className="overlay"
      style={{ position: "fixed", zIndex: 2000 }}
      onClick={(e) => e.target.classList.contains("overlay") && handleClose()}
    >
      <Card
        className="card-escolha"
        style={{ position: "relative", zIndex: 2100 }}
      >
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography
            variant="h6"
            align="center"
            style={{ marginBottom: 8, color: "#226144" }}
          >
            Escolha uma data:
          </Typography>

          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale="pt-br"
          >
            <DateCalendar
              value={value}
              onChange={(newValue) => newValue && setValue(newValue)}
              dayOfWeekFormatter={(day) => day.format("ddd")}
              slots={{
                day: (props) => (
                  <CustomPickersDay
                    {...props}
                    datasExistentes={datasExistentes}
                  />
                ),
              }}
            />
          </LocalizationProvider>

          <Typography
            variant="h6"
            align="center"
            style={{
              marginTop: 16,
              marginBottom: 8,
              color: "#226144",
            }}
          >
            Escolha um horário:
          </Typography>

          <Box mt={1} mb={2}>
            <Select
              fullWidth
              displayEmpty
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              MenuProps={{
                disablePortal: true,
                container: document.body,
                PaperProps: { style: { minWidth: 220, zIndex: 3000 } },
              }}
            >
              <MenuItem value="">
                <em>Escolher Horário</em>
              </MenuItem>
              {horariosDisponiveis.map((h) => (
                <MenuItem key={h} value={h}>
                  {h}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Box display="flex" justifyContent="center" mt={2} gap={2}>
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#226144",
                color: "#fff",
                fontWeight: 300,
                fontSize: "0.8rem",
                borderRadius: "8px",
                padding: "12px 24px",
                minWidth: "140px",
                boxShadow: "0 2px 8px rgba(34,97,68,0.13)",
                "&:hover": { backgroundColor: "#1a4d35" },
              }}
              onClick={handleSave}
            >
              Salvar Data
            </Button>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#226144",
                color: "#fff",
                fontWeight: 300,
                fontSize: "0.8rem",
                borderRadius: "8px",
                padding: "12px 24px",
                minWidth: "140px",
                boxShadow: "0 2px 8px rgba(34,97,68,0.13)",
                "&:hover": { backgroundColor: "#1a4d35" },
              }}
              onClick={handleClose}
            >
              Ver Calendário
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
