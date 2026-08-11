import type { PlantReport } from '../models/plant-report.types';
import './PlantReportView.css';

type Props = {
  loading: boolean;
  error: string | null;
  analysis: PlantReport | null;
};

export const PlantReportView = ({ loading, analysis, error }: Props) => {
  if (loading) {
    return <p>анализируем...</p>;
  }

  if (error) {
    return <p>ошибка: {error}</p>;
  }

  if (!analysis) {
    return null;
  }

  return (
    <div className="report-container">
      {/* ИДЕНТИФИКАЦИЯ */}
      <section className="card header-card">
        <div className="plant-title">
          <h1 id="commonName">{analysis.identification.commonName}</h1>
          <p className="botanical-name" id="botanicalName">
            {analysis.identification.botanicalName}
          </p>
        </div>
        <div>
          <span className="badge badge-success" id="confidence">
            Уверенность: {analysis.identification.confidencePercent}
          </span>
        </div>
      </section>

      {/* ДИАГНОСТИКА ЗДОРОВЬЯ */}
      <section className="card">
        <h2 className="card-title">Диагностика здоровья</h2>

        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-success" id="healthStatus">
            Статус: {analysis.health.status}
          </span>
          <span className="badge badge-success" id="threatLevel">
            Угроза: {analysis.health.threatLevel}
          </span>
        </div>

        <p>
          <strong>Диагноз:</strong> <span id="diagnosis">{analysis.health.diagnosis}</span>
        </p>
        <p id="healthDescription">{analysis.health.description}</p>
      </section>

      {/* ПЛАН ДЕЙСТВИЙ */}
      <section className="card">
        <h2 className="card-title">План действий</h2>

        <div style={{ marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', color: `var(--accent-blue)`, marginBottom: '8px' }}>
            Сделать прямо сейчас:
          </h3>
          <ul className="actions-list" id="urgentActions">
            {analysis.actionPlan.urgentActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </div>

        <hr />

        <div>
          <h3 style={{ fontSize: '1rem', color: `var(--accent-red)`, marginBottom: '8px' }}>
            Категорически запрещено:
          </h3>
          <ul className="prohibitions-list" id="prohibitions">
            {analysis.actionPlan.prohibitions.map((prohibition) => (
              <li key={prohibition}>{prohibition}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* ПАСПОРТ УХОДА */}
      <section className="card">
        <h2 className="card-title">Паспорт ухода</h2>

        <div className="grid-2">
          {/* Освещение */}
          <div className="care-item">
            <h4>Освещение</h4>
            <p>
              <strong id="lightSummary">{analysis.carePassport.lighting.summary}</strong>
            </p>
            <p className="details" id="lightPlacement">
              Идеал: {analysis.carePassport.lighting.idealPlacement}
            </p>
            <p className="details" id="lightDetails">
              {analysis.carePassport.lighting.details}
            </p>
          </div>

          {/* Полив */}
          <div className="care-item">
            <h4>Полив</h4>
            <p id="waterFrequency">{analysis.carePassport.watering.frequency}</p>
            <p className="details" id="waterQuality">
              Вода: {analysis.carePassport.watering.waterQuality}
            </p>
          </div>

          {/* Климат */}
          <div className="care-item">
            <h4>Климат и Влажность</h4>
            <p>
              Влажность: <strong id="humidity">{analysis.carePassport.environment.humidity}</strong>
            </p>
            <p>
              Температура:{' '}
              <strong id="tempOptimal">
                {analysis.carePassport.environment.temperatureOptimal}
              </strong>{' '}
              (мин: <span id="tempMin">{analysis.carePassport.environment.temperatureMinC}</span>°C)
            </p>
            <p className="details" id="envNotes">
              {analysis.carePassport.environment.notes}
            </p>
          </div>

          {/* Почва и Горшок */}
          <div className="care-item">
            <h4>Почва и Горшок</h4>
            <p>
              <strong>Грунт:</strong>{' '}
              <span id="soilMix">{analysis.carePassport.soilAndPot.soilMix}</span>
            </p>
            <p className="details">
              <strong>Горшок:</strong>{' '}
              <span id="potType">{analysis.carePassport.soilAndPot.potType}</span>
            </p>
            <p className="details">
              <strong>Пересадка:</strong>{' '}
              <span id="repottedWhen">{analysis.carePassport.soilAndPot.repottedWhen}</span>
            </p>
          </div>

          {/* Подкормка */}
          <div className="care-item" style={{ gridColumn: '1 / -1' }}>
            <h4>Подкормка</h4>
            <p>
              <span id="fertSchedule">{analysis.carePassport.fertilizing.schedule}</span> -{' '}
              <strong id="fertDosage">{analysis.carePassport.fertilizing.dosage}</strong>
            </p>
            <p className="details" id="fertWarnings">
              {analysis.carePassport.fertilizing.warnings}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
