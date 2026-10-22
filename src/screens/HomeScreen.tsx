import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { Colors, Typography, Spacing } from '../theme';
import { RomanCard } from '../components/RomanCard';
import { RomanButton } from '../components/RomanButton';
import { Citizen, DailyQuest } from '../types';
import { PaideiaRepository } from '../services/PaideiaRepository';
import { VirtusEngine, ExpiatioPenalty } from '../services/VirtusEngine';
import { getDailyQuote, ClassicalQuote } from '../data/ClassicalLibrary';
import { getDatabase } from '../database/db';

export const HomeScreen: React.FC = () => {
  const [citizen, setCitizen] = useState<Citizen | null>(null);
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [penalty, setPenalty] = useState<ExpiatioPenalty | null>(null);
  const [quote, setQuote] = useState<ClassicalQuote>(getDailyQuote());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      await VirtusEngine.ensureDailyQuests();
      const { citizen: currentCitizen, penalty: expiatio } = await VirtusEngine.processDailyCycle();
      setCitizen(currentCitizen);
      setPenalty(expiatio);

      const db = await getDatabase();
      const today = new Date().toISOString().split('T')[0];
      const todayQuests = await db.getAllAsync<DailyQuest>(
        'SELECT * FROM daily_quests WHERE date = ?',
        [today]
      );
      setQuests(todayQuests);
    } catch (e) {
      console.error('Erro ao carregar dados:', e);
    }
  };

  const completeGymnasium = async () => {
    try {
      // Simula 25 flexões verificadas
      await PaideiaRepository.logExercise('PUSHUPS', 25, 60, true);
      Alert.alert('🏛️ Robur Aumentado', '+25 Repetições registradas no Gymnasium!');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const completeLectio = async () => {
    try {
      // Simula 15 páginas lidas do Trivium
      await PaideiaRepository.logReading('Meditações', 'Marco Aurélio', 15, 30);
      Alert.alert('📜 Sapientia Aumentada', '+15 Páginas de clássicos estudadas!');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  const answerExamen = async () => {
    try {
      await PaideiaRepository.saveExamenVesperi(
        'Cumpri os deveres da manhã e mantive a compostura.',
        'Hesitei antes de iniciar a leitura vespertina.',
        'Amanhã acordarei sem pestanejar.'
      );
      Alert.alert('⚖️ Examen Vesperi Registrado', 'A consciência do cidadão foi pesada e aprovada.');
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* Cabeçalho Monumental */}
        <View style={styles.header}>
          <Text style={[Typography.caption, { color: Colors.bronzeGold }]}>
            RES PUBLICA &bull; ANNO DOMINI MMXXVI
          </Text>
          <Text style={[Typography.monumentalTitle, { color: Colors.stoneLight }]}>
            PAIDEIA
          </Text>
          <Text style={[Typography.latinMotto, { color: Colors.stoneMuted }]}>
            "Mens sana in corpore sano"
          </Text>
        </View>

        {/* Alerta de Expiatio se houver quebra de constância */}
        {penalty?.has_penalty && (
          <RomanCard
            variant="alert"
            title="EXPIATIO: PENITÊNCIA DO CARÁTER"
            subtitle="A omissão quebrou a constância do cidadão"
          >
            <Text style={[Typography.body, { color: Colors.stoneLight, marginBottom: Spacing.sm }]}>
              {penalty.reason}
            </Text>
            <Text style={[Typography.body, { color: Colors.stoneLight, fontWeight: 'bold' }]}>
              Dever adicional: +{penalty.required_reps_extra} Repetições e +{penalty.required_pages_extra} Páginas.
            </Text>
          </RomanCard>
        )}

        {/* Status do Cidadão (Cursus Honorum) */}
        {citizen && (
          <RomanCard
            variant="purple"
            title={`CIVIS: ${citizen.name.toUpperCase()}`}
            subtitle={`GRADUS: ${citizen.rank} | CONSTANTIA: ${citizen.constantia_streak} DIAS`}
          >
            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={[Typography.caption, { color: Colors.bronzeGold }]}>VIRTUS</Text>
                <Text style={styles.statValue}>{citizen.virtus_score}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[Typography.caption, { color: Colors.bronzeGold }]}>ROBUR (CORPO)</Text>
                <Text style={styles.statValue}>{citizen.robur_score}</Text>
              </View>
              <View style={styles.statBox}>
                <Text style={[Typography.caption, { color: Colors.bronzeGold }]}>SAPIENTIA (MENTE)</Text>
                <Text style={styles.statValue}>{citizen.sapientia_score}</Text>
              </View>
            </View>
          </RomanCard>
        )}

        {/* Máxima Filosófica Diária */}
        <RomanCard
          variant="travertine"
          title={`SENTENTIA DIEI &bull; ${quote.author.toUpperCase()}`}
          subtitle={quote.source}
        >
          <Text style={[Typography.body, { fontStyle: 'italic', marginBottom: Spacing.xs }]}>
            "{quote.latin}"
          </Text>
          <Text style={[Typography.body, { color: Colors.stoneMuted }]}>
            {quote.portuguese}
          </Text>
        </RomanCard>

        {/* Deveres da Paideia (Quests) */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.sectionTitle, { color: Colors.bronzeGold }]}>
            OFFICIA DIURNA (DEVERES DO DIA)
          </Text>
        </View>

        <RomanCard
          variant="travertine"
          title="I. O GYMNASIUM"
          subtitle="Disciplina dos Músculos &amp; Força"
        >
          <Text style={[Typography.body, { marginBottom: Spacing.sm }]}>
            Execute a cota diária de calistenia supervisionada pela IA do MediaPipe.
          </Text>
          <RomanButton
            title="REGISTRAR REPETIÇÕES"
            onPress={completeGymnasium}
          />
        </RomanCard>

        <RomanCard
          variant="travertine"
          title="II. O STUDIUM &amp; TRIVIUM"
          subtitle="Lectio, Lógica &amp; Clareza Mental"
        >
          <Text style={[Typography.body, { marginBottom: Spacing.sm }]}>
            Leitura focada de clássicos e anotação dos princípios fundamentais.
          </Text>
          <RomanButton
            title="REGISTRAR LEITURA"
            onPress={completeLectio}
          />
        </RomanCard>

        <RomanCard
          variant="travertine"
          title="III. EXAMEN VESPERI"
          subtitle="O Triplo Julgamento da Consciência (Sêneca)"
        >
          <Text style={[Typography.body, { marginBottom: Spacing.sm }]}>
            Submeta seus atos diários à razão antes de deitar a cabeça.
          </Text>
          <RomanButton
            title="REALIZAR EXAME NOTURNO"
            onPress={answerExamen}
          />
        </RomanCard>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.marbleDark,
  },
  container: {
    padding: Spacing.md,
    backgroundColor: Colors.marbleDark,
  },
  header: {
    alignItems: 'center',
    marginVertical: Spacing.lg,
    borderBottomWidth: 1.5,
    borderBottomColor: Colors.bronzeGold,
    paddingBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.stoneLight,
    marginTop: 2,
  },
  sectionHeader: {
    marginVertical: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.bronzeGold,
    paddingLeft: Spacing.sm,
  },
});
