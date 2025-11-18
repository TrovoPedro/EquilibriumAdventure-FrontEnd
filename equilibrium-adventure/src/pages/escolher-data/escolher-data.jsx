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
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useAuth } from "../../context/AuthContext";
import { showSuccess, showError, showWarning } from "../../utils/swalHelper";

import "../escolher-data/escolher-data.css";
import {
  listarAgenda,
  adicionarDisponibilidade,
} from "../../services/chamadasAPIAgenda";
import { listarAnamnesesPorResponsavel } from "../../services/apiAnamnese";
import { buscarEventosAtivosPorGuia } from "../../services/apiEvento";

dayjs.extend(updateLocale);
dayjs.updateLocale("pt-br", { weekStart: 1 });
dayjs.locale("pt-br");

export default function EscolhaDataCard({ onClose }) {
  const { usuario } = useAuth();
  const [value, setValue] = React.useState(null);
  const [hora, setHora] = React.useState("");
  const [horariosDisponiveis, setHorariosDisponiveis] = React.useState([]);
  const [datasCalendario, setDatasCalendario] = React.useState([]);

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

  React.useEffect(() => {
    // só executa se usuario e usuario.id existem
    if (!usuario || !usuario.id) {
      console.log("usuario não disponível ainda");
      return;
    }

    async function fetchDatas() {
      try {
        const dateMap = {};

        const agenda = await listarAgenda();
        agenda.forEach(a => {
          if (a.dataDisponivel) {
            const dateKey = dayjs(a.dataDisponivel).format("YYYY-MM-DD");
            if (!dateMap[dateKey]) {
              dateMap[dateKey] = {
                data: dateKey,
                tipo: "DISP",
                cor: "#C0C0C0",
                descricao: "Disponível",
              };
            }
          }
        });

        const anamneses = await listarAnamnesesPorResponsavel(usuario.id);
        anamneses.forEach(a => {
          if (a.dataDisponivel) {
            const dateKey = dayjs(a.dataDisponivel).format("YYYY-MM-DD");
            dateMap[dateKey] = {
              data: dateKey,
              tipo: "ANAM",
              cor: "#FFA500",
              descricao: a.nomeAventureiro,
            };
          }
        });

        const eventos = await buscarEventosAtivosPorGuia(usuario.id);
        console.log("eventos raw:", eventos);
        eventos.forEach(e => {
          const possibleDateFields = [
            "data_ativacao",
            "data_inicio",
            "data",
            "data_evento",
            "dataEvento",
            "data_inicio_evento"
          ];
          const possibleTimeFields = [
            "hora_inicio",
            "hora",
            "horario_inicio",
            "horario"
          ];

          let dateStr = null;
          for (const f of possibleDateFields) {
            if (e[f]) {
              dateStr = e[f];
              break;
            }
          }

          if (!dateStr) {
            console.log("evento sem campo de data conhecido:", e);
            return;
          }

          let timeStr = null;
          for (const t of possibleTimeFields) {
            if (e[t]) {
              timeStr = e[t];
              break;
            }
          }

          const candidates = [];
          if (timeStr) {
            candidates.push(`${dateStr}T${timeStr}`);
            if (/^\d{2}:\d{2}$/.test(timeStr)) candidates.push(`${dateStr}T${timeStr}:00`);
          }
          candidates.push(`${dateStr}T00:00:00`, dateStr);

          let dataEvento = null;
          let usedCandidate = null;
          for (const c of candidates) {
            const maybe = dayjs(c);
            if (maybe.isValid()) {
              dataEvento = maybe;
              usedCandidate = c;
              break;
            }
          }

          if (!dataEvento) {
            console.log("não conseguiu parsear evento:", e, "candidatos:", candidates);
            return;
          }

          const dateKey = dataEvento.format("YYYY-MM-DD");
          if (!dateMap[dateKey] || dateMap[dateKey].tipo === "DISP") {
            dateMap[dateKey] = {
              data: dateKey,
              tipo: "EVENTO",
              cor: "#4CAF50",
              descricao: e.nome_evento || e.titulo || e.descricao || "Evento",
            };
            console.log("evento registrado em", dateKey, "->", dateMap[dateKey].descricao, "via", usedCandidate);
          }
        });

        const datas = Object.values(dateMap);
        console.log("datasCalendario fetched:", datas);
        setDatasCalendario(datas);
      } catch (err) {
        console.error("Erro ao carregar datas do calendário:", err);
      }
    }

    fetchDatas();
  }, [usuario.id]);

  const handleClose = () => onClose();

  const handleSave = async () => {
    if (!value || !hora) {
      showWarning("Selecione uma data e um horário!");
      return;
    }

    if (!usuario || !usuario.id) {
      showWarning("Usuário não logado. Faça login novamente.");
      return;
    }

    const confirm = await showWarning(
      "Deseja salvar esta data e horário?",
      "Confirmar salvamento",
      "Sim",
      "Cancelar",
      true
    );

    if (!confirm.isConfirmed) return;

    try {
      const dataHoraISO = dayjs(value)
        .hour(parseInt(hora.split(":")[0]))
        .minute(parseInt(hora.split(":")[1]))
        .second(0)
        .format("YYYY-MM-DDTHH:mm:ss");

      await adicionarDisponibilidade({
        fkGuia: usuario.id,
        dataDisponivel: dataHoraISO,
      });

      showSuccess("Disponibilidade adicionada!");
      handleClose();
    } catch (err) {
      console.error(err);
      showError(
        "Erro ao adicionar disponibilidade: " +
          (err.response?.data || err.message)
      );
    }
  };

  function CustomPickersDay(props) {
    const { day, selected, ...other } = props;
    const dayKey = day.format("YYYY-MM-DD");
    const itemDoDia = datasCalendario.find(d => d.data === dayKey);

    const bgColor = itemDoDia
      ? itemDoDia.cor
      : selected
      ? "#27ae60"
      : undefined;

    const hoverColor = itemDoDia
      ? itemDoDia.tipo === "ANAM"
        ? "#e59400"
        : itemDoDia.tipo === "EVENTO"
        ? "#358a39"
        : "#b0b0b0"
      : selected
      ? "#219150"
      : "#f0f0f0";

    return (
      <Tooltip title={itemDoDia?.descricao || ""} arrow>
        <span style={{ display: "inline-block" }}>
          <PickersDay
            {...other}
            day={day}
            selected={selected}
            disabled={!!itemDoDia}
            sx={{
              borderRadius: "50%",
              backgroundColor: bgColor,
              color: itemDoDia ? "#fff" : undefined,
              "&:hover": { 
                backgroundColor: !!itemDoDia ? bgColor : hoverColor,
              },
              "&.Mui-selected": {
                backgroundColor: (itemDoDia ? bgColor : "#27ae60") + " !important",
                color: "#fff",
              },
              "&.Mui-selected:hover": {
                backgroundColor: (itemDoDia ? hoverColor : "#219150") + " !important",
              },
            }}
          />
        </span>
      </Tooltip>
    );
  }

  return (
    <div
      className="overlay"
      style={{ position: "fixed", zIndex: 99999, top: 0, left: 0, right: 0, bottom: 0 }}
      onClick={(e) => e.target.classList.contains("overlay") && handleClose()}
    >
      <Card className="card-escolha" style={{ position: "relative", zIndex: 100000 }}>
        <CardContent>
          <Box display="flex" justifyContent="flex-end">
            <IconButton size="small" onClick={handleClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="h6" align="center" style={{ marginBottom: 8, color: "#226144" }}>
            Escolha uma data:
          </Typography>

          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <DateCalendar
              value={value}
              onChange={(newValue) => newValue && setValue(newValue)}
              dayOfWeekFormatter={(day) => day.format("ddd")}
              slots={{
                day: (props) => <CustomPickersDay {...props} />,
              }}
            />
          </LocalizationProvider>

          <Typography variant="h6" align="center" style={{ marginTop: 16, marginBottom: 8, color: "#226144" }}>
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
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}
