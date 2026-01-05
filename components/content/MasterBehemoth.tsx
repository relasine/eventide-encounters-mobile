import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from 'expo-linear-gradient'
import { useState } from 'react'
import { Ability, MasterBehemoth as MasterBehemothType, Escalation as EscalationType, BackInTown as BackInTownType } from "@/constants/types"
import { Colors } from "@/constants/theme"

export const MasterBehemoth = (props: { encounter: MasterBehemothType, generateBehemoth: () => void }) => {
    const { encounter, generateBehemoth } = props;
    const colors = Colors.dark;
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    return (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.title}>{encounter.name}</Text>
                </View>

                <LinearGradient
                    colors={colors.accentGradient as [string, string, ...string[]]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.buttonGradient}
                >
                    <TouchableOpacity 
                        style={styles.generateButton} 
                        onPress={generateBehemoth}
                        activeOpacity={0.9}
                    >
                        <Text style={styles.generateButtonText}>Roll for Behemoth</Text>
                    </TouchableOpacity>
                </LinearGradient>

                <View style={styles.descriptionSection}>
                    <TouchableOpacity 
                        activeOpacity={0.7}
                        onPress={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    >
                        {isDescriptionExpanded ? (
                            encounter.description.map((sentence, index) => (
                                <Text key={index} style={styles.descriptionText}>{sentence}</Text>
                            ))
                        ) : (
                            <Text style={styles.descriptionText}>{encounter.description[0]}</Text>
                        )}
                        <Text style={styles.descriptionToggle}>
                            {isDescriptionExpanded ? 'Show less' : 'Show more'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.levelContainer}>
                    <View style={styles.levelBadge}>
                        <Text style={styles.levelText}>Level {encounter.level}</Text>
                    </View>
                </View>
                
                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Health</Text>
                        <Text style={styles.statValue}>{encounter.health}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Attacks/Round</Text>
                        <Text style={styles.statValue}>{encounter.attacksPerRound}</Text>
                    </View>
                </View>

                <Abilities abilities={encounter.abilities} />
                {(encounter as any).attacks && <Attacks attacks={(encounter as any).attacks} />}
                <Escalation escalation={encounter.escalation} />
                <Rewards rewards={encounter.rewards} />
                <BackInTown backInTown={encounter.backInTown} />
            </View>
        </ScrollView>
)}

const Abilities = (props: { abilities: Ability[] }) => {
    const { abilities } = props;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Abilities</Text>
            {abilities.map((ability, index) => (
                <View key={ability.name || index} style={styles.abilityCard}>
                    <Text style={styles.abilityName}>{ability.name}</Text>
                    <Text style={styles.abilityTrigger}>{ability.trigger}</Text>
                    <Text style={styles.abilityAction}>{ability.action}</Text>
                </View>
            ))}
        </View>
    )
}

const Rewards = (props: { rewards: string[] }) => {
    const { rewards } = props;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Rewards</Text>
            <View style={styles.rewardsCard}>
                {rewards.map((reward, index) => (
                    <View key={reward || index} style={styles.rewardItem}>
                        <View style={styles.rewardBullet} />
                        <Text style={styles.rewardText}>{reward}</Text>
                    </View>
                ))}
            </View>
        </View>
    )
}

const Escalation = (props: { escalation: EscalationType[] }) => {
    const { escalation } = props;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Escalation</Text>
            {escalation.map((esc, index) => (
                <View key={esc.threshold || index} style={styles.escalationCard}>
                    <View style={styles.escalationHeader}>
                        <View style={styles.escalationBadge}>
                            <Text style={styles.escalationThreshold}>{esc.threshold} HP</Text>
                        </View>
                    </View>
                    <Text style={styles.escalationDescription}>{esc.description}</Text>
                </View>
            ))}
        </View>
    )
}

const Attacks = (props: { attacks: Array<{ d6: number; action: string }> | { d6: number; action: string } }) => {
    const { attacks } = props;
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Attacks</Text>
            {Array.isArray(attacks) ? (
                attacks.map((attack, index) => (
                    <View key={index} style={styles.attackCard}>
                        <View style={styles.attackHeader}>
                            <View style={styles.attackBadge}>
                                <Text style={styles.attackBadgeText}>d6: {attack.d6}</Text>
                            </View>
                        </View>
                        <Text style={styles.attackAction}>{attack.action}</Text>
                    </View>
                ))
            ) : (
                <View style={styles.attackCard}>
                    <View style={styles.attackHeader}>
                        <View style={styles.attackBadge}>
                            <Text style={styles.attackBadgeText}>d6: {attacks.d6}</Text>
                        </View>
                    </View>
                    <Text style={styles.attackAction}>{attacks.action}</Text>
                </View>
            )}
        </View>
    )
}

const BackInTown = (props: { backInTown: BackInTownType }) => {
    const { backInTown } = props;
    const [isRevealed, setIsRevealed] = useState(false);
    
    return (
        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Back in Town</Text>
            <View style={styles.backInTownCard}>
                {isRevealed ? (
                    <>
                        {backInTown.map((text, index) => (
                            <Text key={text || index} style={styles.backInTownText}>{text}</Text>
                        ))}
                        <TouchableOpacity 
                            onPress={() => setIsRevealed(false)}
                            activeOpacity={0.7}
                            style={styles.revealButton}
                        >
                            <Text style={styles.revealButtonText}>Hide</Text>
                        </TouchableOpacity>
                    </>
                ) : (
                    <TouchableOpacity 
                        onPress={() => setIsRevealed(true)}
                        activeOpacity={0.7}
                        style={styles.revealButton}
                    >
                        <Text style={styles.revealButtonText}>Reveal</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        width: '100%',
        paddingBottom: 20,
    },
    header: {
        marginBottom: 24,
        gap: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: Colors.dark.text,
        lineHeight: 40,
    },
    buttonGradient: {
        borderRadius: 14,
        marginBottom: 24,
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 20,
        elevation: 8,
    },
    generateButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 56,
    },
    generateButtonText: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.text,
        letterSpacing: 0.5,
    },
    descriptionSection: {
        marginBottom: 24,
    },
    descriptionText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        marginBottom: 12,
    },
    descriptionToggle: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginTop: 4,
    },
    levelContainer: {
        marginBottom: 16,
    },
    levelBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.dark.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    levelText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 16,
        marginBottom: 32,
        paddingBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: Colors.dark.border,
    },
    statItem: {
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: Colors.dark.textTertiary,
        marginBottom: 4,
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '700',
        color: Colors.dark.text,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: Colors.dark.text,
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    abilityCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginBottom: 12,
    },
    abilityName: {
        fontSize: 18,
        fontWeight: '600',
        color: Colors.dark.accent,
        marginBottom: 8,
    },
    abilityTrigger: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.accent,
        fontStyle: 'italic',
        marginBottom: 8,
    },
    abilityAction: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    escalationCard: {
        backgroundColor: Colors.dark.backgroundTertiary,
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
        marginBottom: 12,
    },
    escalationHeader: {
        marginBottom: 12,
    },
    escalationBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.dark.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    escalationThreshold: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    escalationDescription: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
    rewardsCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        paddingBottom: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
    },
    rewardItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
    },
    rewardBullet: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.dark.accent,
        marginTop: 8,
        marginRight: 12,
    },
    rewardText: {
        flex: 1,
        fontSize: 16,
        color: Colors.dark.text,
        lineHeight: 24,
    },
    backInTownCard: {
        backgroundColor: Colors.dark.backgroundTertiary,
        padding: 16,
        paddingTop: 8,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.border,
    },
    backInTownText: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
        marginBottom: 12,
    },
    revealButton: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        alignSelf: 'flex-start',
    },
    revealButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.accent,
    },
    attackCard: {
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.dark.borderSecondary,
        marginBottom: 12,
    },
    attackHeader: {
        marginBottom: 12,
    },
    attackBadge: {
        alignSelf: 'flex-start',
        backgroundColor: Colors.dark.accent,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        shadowColor: Colors.dark.accent,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    attackBadgeText: {
        fontSize: 14,
        fontWeight: '600',
        color: Colors.dark.text,
    },
    attackAction: {
        fontSize: 16,
        color: Colors.dark.textSecondary,
        lineHeight: 24,
    },
});